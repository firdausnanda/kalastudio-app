export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <div
            {...props}
            className={`flex items-center gap-1.5 px-1 mt-1.5 animate-in slide-in-from-top-1 fade-in duration-300 ${className}`}
        >
            <span className="material-symbols-outlined text-[16px] text-rose-500 dark:text-rose-400 font-medium">
                error
            </span>
            <p className="text-[13px] font-medium text-rose-600 dark:text-rose-400 leading-tight">
                {message}
            </p>
        </div>
    ) : null;
}
