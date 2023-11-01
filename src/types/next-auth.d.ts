import { UserCredential } from 'firebase/auth';
import 'next-auth';

declare module 'next-auth' {
    type User = UserCredential & User;
}
