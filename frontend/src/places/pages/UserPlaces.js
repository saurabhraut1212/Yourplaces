import React ,{useEffect,useState} from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal'; 
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const UserPlaces = () => {
    const [loadesPlaces,setLoadesPlaces]=useState();
    const {isLoading,error,sendRequest,clearError}=useHttpClient();
    const userId=useParams().userId;

    useEffect(()=>{
        const fetchPlaces=async ()=>{
         try {
             const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`);
            setLoadesPlaces(responseData.places)
         } catch (error) {
            
         }
        }
        fetchPlaces()

    },[sendRequest,userId])

    const placeDeleteHandler=(deletedPlaceId)=>{
        setLoadesPlaces(prePlaces=>prePlaces.filter(place=>place.id!==deletedPlaceId))

    }
   
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            {isLoading && 
            <div className="center">
                <LoadingSpinner/>
                </div>}
        {!isLoading && loadesPlaces && <PlaceList items={loadesPlaces} onDeletePlace={placeDeleteHandler}/>} 
        </React.Fragment>   );
};

export default UserPlaces;