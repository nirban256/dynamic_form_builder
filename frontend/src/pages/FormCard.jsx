import { Link } from "react-router-dom";

const FormCard = ({ form }) => {
    const copyToClipboard = () => {
        const formUrl = `${window.location.origin}/form/${form._id}`;
        const textArea = document.createElement("textarea");
        textArea.value = formUrl;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            alert('Link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
        document.body.removeChild(textArea);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-semibold text-gray-800">
                    {form.title}
                </h3>
            </div>
            <div className="mt-6 flex items-center justify-end space-x-3">
                <Link to={`/form/${form._id}`} target="_blank" className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                    View Live Form
                </Link>
                <button onClick={copyToClipboard} className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                    Copy Link
                </button>
            </div>
        </div>
    );
};

export default FormCard;