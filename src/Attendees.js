import React from 'react';
import { gql } from 'apollo-boost';
import { Query, Mutation } from 'react-apollo';

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

const MUTATION = gql`
    mutation deleteAttendee($id: ID!) {
        deleteAttendee(where: { id: $id }) {
            id
        }
    }
`;

export default () => (
    <Query query={QUERY}>
        {({ data: { attendees }, error, loading }) => {
            if (error) return 'OH NOOOOOOOOO :(';
            if (loading) return 'CHILLLL TF DOWN';

            return (
                <ul>
                    {attendees.map(attendee => (
                        <li key={attendee.id}>
                            {attendee.name}
                            <Mutation
                                mutation={MUTATION}
                                update={(
                                    cache,
                                    { data: { deleteAttendee } }
                                ) => {
                                    const { attendees } = cache.readQuery({
                                        query: QUERY
                                    });
                                    cache.writeQuery({
                                        query: QUERY,
                                        data: {
                                            attendees: attendees.filter(
                                                a => a.id !== deleteAttendee.id
                                            )
                                        }
                                    });
                                }}
                            >
                                {deleteAttendee => (
                                    <button
                                        onClick={() =>
                                            deleteAttendee({
                                                variables: {
                                                    id: attendee.id
                                                }
                                            })
                                        }
                                    >
                                        Delete
                                    </button>
                                )}
                            </Mutation>
                        </li>
                    ))}
                </ul>
            );
        }}
    </Query>
);
