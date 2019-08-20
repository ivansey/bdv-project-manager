import React from 'react';

class Quote extends React.Component {
    render() {
        return <div className="quote">
            <p className="text">{this.props.text}</p>
            {
                this.props.author
                    ? <p className="author">{this.props.author}</p>
                    : null
            }
        </div>
    }
};

export default Quote;