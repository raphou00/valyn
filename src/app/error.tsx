"use client";

const RootError: React.FC = () => {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center gap-y-4">
            <h1 className="text-5xl">500</h1>
            <p>Something went wrong.</p>
        </div>
    );
};

export default RootError;
