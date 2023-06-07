import * as React from "react"
import { memo } from "react"

const SvgComponent = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={200}
        height={200}
        viewBox="0 0 2 2"
        xmlSpace="preserve"
        {...props}
    >
        <path d="m1.066 2.961 3.736 3.736-1.037 1.036L.029 3.998z" />
        <path d="M1.607 3.161h6.375v1.683H1.607z" />
        <path d="M.023 4.004 3.758.267l1.037 1.036L1.059 5.04z" />
    </svg>
)

const LeftArrow = memo(SvgComponent)
export default LeftArrow
