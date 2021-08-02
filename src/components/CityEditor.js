import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useRouteMatch } from "react-router-dom";
import { sendDataToServer, getDataFromServer } from "./DataSender";
import {Typography, Grid,Container} from '@material-ui/core';
import useStyles from "../styles";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const CityEditor = () => {
    const classes = useStyles();
    const curEditModePath="/editcity/:cityId";
    const match = useRouteMatch();
    const {cityId} = useParams();
    const [regionsList,setRegionsList] = useState('');
    const [cityName,setCityName] = useState('');
    const [curRegion,setCurRegion] = useState();

    const [snackBarMsg, setSnackBarMsg] = useState('');//snackbar
    const [open, setOpen] = useState(false);//snackbar
    const handleClose = (event, reason) => {//snackbar
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

      
    const clickSubmit = async (e) => {
        e.preventDefault();
        setCityName('');
        let route='cities/';
        let reqMethod='POST';

        if (cityId && match.path===curEditModePath){
            route+=cityId;
            reqMethod='PUT';
        }

        const res = await sendDataToServer({route:route,reqMethod:reqMethod,reqBody:{cityName:cityName,regionId:curRegion}});

        if (res.status===201){
            setSnackBarMsg(`Added a new city with ID ${res.data.id}, regionId = ${res.data.regionId} and name = ${res.data.name}`);
          }else if (res.status===200){
            setSnackBarMsg(`Saved changes to city with ID ${res.data.id}, regionId = ${res.data.regionId}  and name = ${res.data.name}`);
          }else{
            setSnackBarMsg('Something went wrong.');
          }
          setOpen(true);

    }

    
    useEffect(()=>{
        const getAllRegions = async () => {
            const resRegions = await getDataFromServer({route:'regions'});
            setRegionsList(resRegions.items);
            if (cityId && match.path===curEditModePath){ //Edit mode
                const resCity = await getDataFromServer({route:'cities',id:cityId});
                setCityName(resCity.name);
                setCurRegion(resCity.regionId);
            }else{ //Add new mode
                setCurRegion(resRegions.items[0].id);
            }
        }
        getAllRegions()
    },[cityId,match.path])

    if (!regionsList)return <p>Loading...</p>
    return (<>
        <Container maxWidth='md'>
        <Typography variant='h4' align='center' color='textPrimary' gutterBottom>
            {cityId && match.path===curEditModePath? 'Edit city' : 'Add new city'}
        </Typography>
      </Container>
      <Container maxWidth='md' className={classes.cardGrid} >
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
        <form onSubmit={clickSubmit}>
            <select name='region' onChange={(e)=>{setCurRegion(parseInt(e.target.value))}} value={curRegion} >
                {regionsList.map(region=><option key={`regionKey${region.id}`} value={region.id}>{region.regionName}</option>)}
            </select><br/>
            <input type='text' placeholder='City name' value={cityName} onChange={(e)=>setCityName(e.target.value)} />
            <input type='submit' value='Send'/>
        </form>
        </Grid>
        </Grid>
        </Container>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          {snackBarMsg}
        </Alert>
      </Snackbar>
    </>
    )
};

export default CityEditor