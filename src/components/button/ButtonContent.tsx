
interface ButtonContentProps {
    titleBtn?: string;
    linkBtn?: string;
    gmbUrl?: boolean;
}

const ButtonContent: React.FC<ButtonContentProps> = ({ titleBtn, linkBtn }) => {
    return (
        <div>
            <a
                href={`${linkBtn ? linkBtn : "/contact"}`}
                className={`text-lg font-semibold text-white capitalize bg-btnHoverColor`}
                aria-label={titleBtn ? titleBtn : "Free Estimate"}
            >
                <button className="btnStyle1">
                    {titleBtn ? titleBtn : "Free Estimate"}
                </button>
            </a>
        </div>
    );
}

export default ButtonContent;