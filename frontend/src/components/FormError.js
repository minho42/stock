import { ExclamationIcon } from "@heroicons/react/solid";

export const FormError = ({ touched, message }) => {
  if (message) {
    return (
      <div className="flex items-center text-red-600 mt-1 space-x-2">
        <ExclamationIcon className="w-4 h-4" />
        <div className="">{message}</div>
      </div>
    );
  }
  return <div></div>;
};
