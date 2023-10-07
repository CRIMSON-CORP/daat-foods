// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
    addDoc,
    collection,
    doc,
    getDocs,
    getFirestore,
    increment,
    serverTimestamp,
    setDoc,
    updateDoc,
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
