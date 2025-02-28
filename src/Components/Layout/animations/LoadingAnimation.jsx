import styled from "tachyons-components";
import ReactLoading from "react-loading";
export const SpinnerList = [
    {
        prop: "balls",
        name: "Balls",
    },
];

export const Section = styled("div")`
flex flex-wrap content-center justify-center w-100 h-100`;

export const Article = styled("div")`
w-25 ma2 h4 items-center justify-center flex flex-column flex-wrap`;

export const Title = styled("h1")`
f4 f3-ns white w-100 tc`;
import React from 'react'

const LoadingAnimation = () => {
    return (
        <Section>
            {SpinnerList.map((l) => (
                <Article key={l.prop}>
                    <ReactLoading type={l.prop} color="#FB0461" />
                </Article>
            ))}
        </Section>
    )
}

export default LoadingAnimation;

