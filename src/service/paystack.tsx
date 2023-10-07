import axios from 'axios';

export async function verifyTransaction(reference: string) {
    try {
        const { data } = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_API_SECRET_KEY}`,
                },
            },
        );
        if (data.data.status === 'pending') {
            verifyTransaction(reference);
        }

        return data;
    } catch (error) {
        throw error;
    }
}
