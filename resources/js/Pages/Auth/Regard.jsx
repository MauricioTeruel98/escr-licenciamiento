import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InstructionsLayout from "@/Layouts/InstructionsLayout";

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <InstructionsLayout title="Regard">
            <div className="max-w-md w-full mx-auto">
                <h1 className="text-2xl font-semibold mb-8">Ingresar</h1>



            </div>
        </InstructionsLayout>
    );
}