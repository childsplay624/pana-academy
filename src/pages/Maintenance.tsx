import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings, Wrench, Clock, ShieldCheck } from 'lucide-react';

export default function Maintenance() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100 relative overflow-hidden">
                {/* Background Accents */}
                <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-secondary/5 rounded-full blur-3xl"></div>

                <div className="relative">
                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <Wrench className="w-10 h-10 text-primary" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        System Maintenance
                    </h1>

                    <p className="text-lg text-slate-600 mb-10 max-w-lg mx-auto leading-relaxed">
                        We're currently performing some essential updates to improve your experience.
                        We'll be back online shortly!
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <Clock className="w-6 h-6 text-primary mb-3" />
                            <h3 className="font-bold text-slate-900">Estimated Time</h3>
                            <p className="text-sm text-slate-500">~ 2 hours</p>
                        </div>
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <Settings className="w-6 h-6 text-primary mb-3" />
                            <h3 className="font-bold text-slate-900">What's Happening?</h3>
                            <p className="text-sm text-slate-500">Backend optimization</p>
                        </div>
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <ShieldCheck className="w-6 h-6 text-primary mb-3" />
                            <h3 className="font-bold text-slate-900">Security</h3>
                            <p className="text-sm text-slate-500">Infrastructure audit</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            variant="outline"
                            className="rounded-full px-8"
                            onClick={() => window.location.reload()}
                        >
                            Check Again
                        </Button>
                        <Button
                            className="rounded-full px-8"
                            onClick={() => window.location.href = "mailto:support@pana-academy.com"}
                        >
                            Contact Support
                        </Button>
                    </div>
                </div>
            </div>

            <p className="mt-8 text-slate-400 text-sm font-medium">
                © {new Date().getFullYear()} PANA Institute. All rights reserved.
            </p>
        </div>
    );
}
