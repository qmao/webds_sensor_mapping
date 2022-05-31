import React from "react";

import SvgIcon from "@mui/material/SvgIcon";

export const Axis: JSX.Element = (
        <SvgIcon>
            <svg width="100" height="100" viewBox="0 0 512 512">
                <g transform="translate(29.632 -.5)">
                    <path
                        d="M10 70V30.24"
                        fill="none"
                        stroke="#000"
                        stroke-width="2"
                        stroke-miterlimit="10"
                        pointer-events="stroke"
                    />
                    <path
                        d="m10 22.24 4 8H6Z"
                        stroke="#000"
                        stroke-width="2"
                        stroke-miterlimit="10"
                        pointer-events="all"
                    />
                    <path
                        d="M9 70h40.76"
                        fill="none"
                        stroke="#000"
                        stroke-width="2"
                        stroke-miterlimit="10"
                        pointer-events="stroke"
                    />
                    <path
                        d="m57.76 70-8 4v-8z"
                        stroke="#000"
                        stroke-width="2"
                        stroke-miterlimit="10"
                        pointer-events="all"
                    />
                    <path fill="none" pointer-events="all" d="M0 0h20v20H0z" />
                    <switch transform="translate(-.5 -.5)">
                        <text
                            x="10"
                            y="14"
                            font-family="Helvetica"
                            font-size="12"
                            text-anchor="middle"
                        >
                            X
            </text>
                    </switch>
                    <path fill="none" pointer-events="all" d="M60 60h20v20H60z" />
                    <switch transform="translate(-.5 -.5)">
                        <text
                            x="70"
                            y="74"
                            font-family="Helvetica"
                            font-size="12"
                            text-anchor="middle"
                        >
                            Y
            </text>
                    </switch>
                </g>
            </svg>
        </SvgIcon>
    );
