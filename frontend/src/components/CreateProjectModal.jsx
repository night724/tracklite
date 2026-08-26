import {
    useState
} from "react";

import api from "../api/client";

export default function CreateProjectModal({

    onClose,

    onCreated

}) {

    const [name, setName] =
        useState("");

    const [description, setDescription] =
        useState("");

    async function create() {

        try {

            await api.post(

                "/projects",

                {

                    name,

                    description

                }

            );

            onCreated();

        }
        catch (error) {

            console.error(
                error
            );

        }

    }

    return (

        <div className="modal-backdrop">


            <div className="modal">


                <h2>
                    Create Project
                </h2>

                <input

                    placeholder="Project name"

                    value={name}

                    onChange={
                        e =>
                            setName(
                                e.target.value
                            )
                    }

                />

                <textarea

                    placeholder="Description"

                    value={description}

                    onChange={
                        e =>
                            setDescription(
                                e.target.value
                            )
                    }

                />

                <div>


                    <button
                        onClick={onClose}
                    >

                        Cancel

                    </button>



                    <button

                        className="primary-button"

                        onClick={create}

                    >

                        Create

                    </button>


                </div>


            </div>


        </div>

    );

}