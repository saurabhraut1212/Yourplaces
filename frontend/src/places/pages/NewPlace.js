import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/Util/Validators"
import "./PlaceForm.css"
import Button from '../../shared/components/FormElements/Button';
import useForm from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';


const NewPlace = () => {
    const auth = useContext(AuthContext)
    
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [formState, InputHandler] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        address: {
            value: '',
            isValid: false
        },
        image:{
            value:null,
            isValid:false
        }
    }, false)

    const navigate = useNavigate();


    const placeSubmitHandle = async (event) => {
        console.log(auth.token)
        event.preventDefault();
        try {
            const formData=new FormData();
            formData.append('title', formState.inputs.title.value);
            formData.append('description', formState.inputs.description.value);
            formData.append('address', formState.inputs.address.value);
            formData.append('creator', auth.userId);
            formData.append('image', formState.inputs.image.value);

           await  sendRequest(process.env.REACT_APP_BACKEND_URL +'/places', 'POST',
           formData,
           { Authorization: 'Bearer ' + auth.token}
            );
            navigate('/')
            //redirect the user to different page
            
        } catch (error) {
            
        }
       
       
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
        <form className="place-form" onSubmit={placeSubmitHandle}>
            {isLoading && <LoadingSpinner asOverlay/>}
            <Input
                id="title"
                element="input"
                type="text"
                label="Title"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid title"
                onInput={InputHandler} />

            <Input
                id="description"
                element="textarea"

                label="Description "
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Please enter a valid description (atleast 5 characters)"
                onInput={InputHandler} />

            <Input
                id="address"
                element="input"
                label="Address"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid address"
                onInput={InputHandler} />
                <ImageUpload id="image" center  onInput={InputHandler} errorText="Please provide an image."/>

            <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
        </form>
        </React.Fragment>
    );
};


export default NewPlace;