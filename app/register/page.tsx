import SignupForm from '@/domains/auth/components/SignupForm';

export default function RegisterPage() {
    return (
        <main className="flex min-h-[calc(100dvh-70px)] items-center justify-center px-4 py-10">
            <SignupForm />
        </main>
    );
}