import React from 'react';
import { Button } from 'react-bootstrap';

export function LoadingButton(props) {
    const [isLoading, setLoading] = React.useState(false);

    const handleClick = () => {
        setLoading(true);
        props.onClick(setLoading);
    };

    return (
        <Button
            variant="primary"
            className={ props.className }
            disabled={isLoading}
            onClick={!isLoading ? handleClick : null}
        >
            {isLoading? "Loading..." : props.value}
        </Button>
    );
}