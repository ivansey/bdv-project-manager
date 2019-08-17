import React from 'react';
import axios from 'axios';

class Activate extends React.Component {
    constructor(props) {
        super(props);

        this.activateUser();
    }

    activateUser = () => {
        axios.post("http://localhost:3001/api/v1/users/activate", {
            id: this.props.match.params.id
        });
    }

    render() {
        return <div>Вы активировали свой аккаунт</div>
    }
}

export default Activate;