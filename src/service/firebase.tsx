// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import {
    addDoc,
    collection,
    doc,
    getCountFromServer,
    getDocs,
    getFirestore,
    increment,
    limit,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    startAfter,
    startAt,
    updateDoc,
    where,
} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);

const productCollection = collection(firestore, 'products');
const transactionCollection = collection(firestore, 'transactions');
const ordersCollection = collection(firestore, 'orders');

export async function getProducts() {
    const productsQuerySnapshot = await getDocs(productCollection);
    const products: ProductItem[] = [];

    productsQuerySnapshot.forEach((doc) => {
        const { name, created_at, image, price, quantity_in_stock } =
            doc.data();

        products.push({
            id: doc.id,
            name,
            created_at: created_at.toDate().getTime().toString(),
            image,
            price,
            quantity_in_stock,
        });
    });

    return products;
}

export async function addTransactionRecord(transactionObject: any) {
    await setDoc(
        doc(transactionCollection, transactionObject.data.reference),
        transactionObject,
    );
}

export async function createOrder(order: Order) {
    // decrement store quantity with quantity bought
    await Promise.all(
        order.cart.map((cartItem) => {
            const prodcutDoc = doc(productCollection, cartItem.id);
            return updateDoc(prodcutDoc, {
                quantity_in_stock: increment(-cartItem.quantity),
            });
        }),
    );

    const docRef = await addDoc(ordersCollection, {
        ...order,
        created_at: serverTimestamp(),
    });
    return docRef.id;
}

export async function signInAdmin(email: string, password: string) {
    try {
        const user = await signInWithEmailAndPassword(auth, email, password);
        return user;
    } catch (error) {
        throw error;
    }
}

export async function getOrders() {
    try {
        const orderTableQuery = query(
            ordersCollection,
            orderBy('created_at', 'asc'),
            limit(20),
        );
        const ordersQuerySnapshot = await getDocs(orderTableQuery);

        const orders: (Order & { id: string })[] = [];

        ordersQuerySnapshot.forEach((doc) => {
            orders.push({
                id: doc.id,
                cart: doc.data().cart,
                created_at: doc.data().created_at.toDate().getTime().toString(),
                status: doc.data().status,
                total: doc.data().total,
                transaction_reference: doc.data().transaction_reference,
                user: doc.data().user,
            });
        });
        return orders;
    } catch (error) {
        throw error;
    }
}

export async function getPaginatedOrders(lastDocument: any) {
    try {
        const orderTableQuery = query(
            ordersCollection,
            orderBy('created_at', 'asc'),
            startAt(lastDocument),
            limit(20),
            startAfter(lastDocument),
        );
        const ordersQuerySnapshot = await getDocs(orderTableQuery);

        const orders: (Order & { id: string })[] = [];

        ordersQuerySnapshot.forEach((doc) => {
            orders.push({
                id: doc.id,
                cart: doc.data().cart,
                created_at: doc.data().created_at.toDate().getTime().toString(),
                status: doc.data().status,
                total: doc.data().total,
                transaction_reference: doc.data().transaction_reference,
                user: doc.data().user,
            });
        });
    } catch (error) {
        throw error;
    }
}

export async function getOrderMetrics() {
    try {
        const pendingOrdersCountQuery = query(
            ordersCollection,
            where('status', '==', 'pending'),
        );
        const inProgressOrdersCountQuery = query(
            ordersCollection,
            where('status', '==', 'inprogress'),
        );
        const completedOrdersCountQuery = query(
            ordersCollection,
            where('status', '==', 'completed'),
        );
        const failedOrdersCountQuery = query(
            ordersCollection,
            where('status', '==', 'failed'),
        );
        const [pending, inprogress, completed, failed] = await Promise.all(
            [
                pendingOrdersCountQuery,
                inProgressOrdersCountQuery,
                completedOrdersCountQuery,
                failedOrdersCountQuery,
            ].map((query) => getCountFromServer(query)),
        );

        return {
            pending: pending.data().count,
            inprogress: inprogress.data().count,
            completed: completed.data().count,
            failed: failed.data().count,
        };
    } catch (error) {}
}

export async function signOutAdmin() {
    try {
        await signOut(auth);
    } catch (error) {
        throw error;
    }
}

export function getCurrentUser() {
    return auth.currentUser;
}
