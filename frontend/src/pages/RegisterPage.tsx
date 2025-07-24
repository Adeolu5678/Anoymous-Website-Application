import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import FormInput from '../components/common/FormInput';
import authService from '../api/authService';

const RegisterSchema = Yup.object().shape({
    username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be less than 20 characters')
        .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
        .required('Username is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password')
});

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');

    const handleSubmit = async (values: { username: string; password: string }) => {
        try {
            setError('');
            await authService.register(values.username, values.password);
            // After successful registration, log the user in
            await authService.login(values.username, values.password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to register. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign in
                        </Link>
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <Formik
                    initialValues={{ username: '', password: '', confirmPassword: '' }}
                    validationSchema={RegisterSchema}
                    onSubmit={handleSubmit}
                >
                    <Form className="mt-8 space-y-6">
                        <FormInput
                            label="Username"
                            name="username"
                            type="text"
                            placeholder="Choose a username"
                        />
                        <FormInput
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Choose a password"
                        />
                        <FormInput
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                        />

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Create Account
                            </button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );
};

export default RegisterPage; 