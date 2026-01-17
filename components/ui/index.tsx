export const Button = ({ children, ...props }: any) => (
  <button
    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    {...props}
  >
    {children}
  </button>
);

export const Input = (props: any) => (
  <input
    className="px-3 py-2 border rounded w-full"
    {...props}
  />
);

export const Card = ({ children, ...props }: any) => (
  <div
    className="p-4 border rounded-lg bg-white shadow-sm"
    {...props}
  >
    {children}
  </div>
);
