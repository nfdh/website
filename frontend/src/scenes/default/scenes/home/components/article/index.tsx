import * as React from "react";

interface ArticleProps {
    title: string,
    content: string
}

function Article(props: ArticleProps) {
    return <div>
        <h4>{props.title}</h4>
        <div>
            {props.content}
        </div>
    </div>;
}