import React, { Component } from 'react';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';

const MUTATION = gql`
    mutation createAttendee($name: String!, $age: Int!, $location: String) {
        createAttendee(data: { name: $name, age: $age, location: $location }) {
            name
            id
            location
            age
        }
    }
`;

const QUERY = gql`
    {
        attendees {
            name
            id
            location
            age
        }
    }
`;

export default class extends Component {
    state = {
        name: '',
        age: '',
        location: ''
    };
    render = () => (
        <Mutation
            mutation={MUTATION}
            update={(cache, { data: { createAttendee } }) => {
                const { attendees } = cache.readQuery({
                    query: QUERY
                });
                cache.writeQuery({
                    query: QUERY,
                    data: {
                        attendees: attendees.concat([createAttendee])
                    }
                });
            }}
        >
            {createAttendee => (
                <form
                    onSubmit={async e => {
                        e.preventDefault();
                        await createAttendee({
                            variables: {
                                ...this.state,
                                age: parseInt(this.state.age, 10)
                            }
                        });
                        this.setState({
                            name: '',
                            age: '',
                            location: ''
                        });
                    }}
                >
                    <input
                        type="text"
                        required
                        value={this.state.name}
                        onChange={e =>
                            this.setState({
                                ...this.state,
                                name: e.target.value
                            })
                        }
                        placeholder="YOUR NAME SON"
                    />
                    <input
                        type="number"
                        required
                        value={this.state.age}
                        onChange={e =>
                            this.setState({
                                ...this.state,
                                age: e.target.value
                            })
                        }
                        placeholder="YOUR AGE SON"
                    />
                    <input
                        type="text"
                        value={this.state.location}
                        onChange={e =>
                            this.setState({
                                ...this.state,
                                location: e.target.value
                            })
                        }
                        placeholder="YOUR LOCATION SON"
                    />
                    <button type="submit">GOOO </button>
                </form>
            )}
        </Mutation>
    );
}
