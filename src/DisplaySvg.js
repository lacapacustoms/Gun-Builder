import InlineSVG from "react-inlinesvg";

export const DisplaySvg = ({ string, gunRef }) => {
    return (
        <div>
            <InlineSVG src={string} />
        </div>
    )
}
