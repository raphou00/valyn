const RootNotFound: React.FC = () => {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center gap-y-4">
            <h1 className="text-5xl">404</h1>
            <p>Page not found</p>
        </div>
    );
};

export const dynamic = "force-static";
export default RootNotFound;
