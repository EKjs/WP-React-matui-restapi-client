import { useContext,useEffect, useState } from "react";
import { useParams } from "react-router";
import { useRouteMatch } from "react-router-dom";
import { sendDataToServer, getDataFromServer } from "./DataSender";
import {Typography, Grid,Container} from '@material-ui/core';
import useStyles from "../styles";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import LoginContext from "./LoginContext";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  
const RegionEditor = () => {
  const {isLoggedIn} = useContext(LoginContext);
    const classes = useStyles();
    const curEditModePath="/editregion/:regionId";
    const match = useRouteMatch();
    const {regionId} = useParams();
    const [regionData,setRegionData] = useState('');

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
        setRegionData('');
        let route='regions/';
        let reqMethod='POST';

        if (regionId && match.path===curEditModePath){
            route+=regionId;
            reqMethod='PUT';
        }

        const res = await sendDataToServer({route:route,reqMethod:reqMethod,reqBody:{regionName:regionData}});

        if (res.status===201){
            setSnackBarMsg(`Added a new region with ID ${res.data.id} and regionName = ${res.data.regionName}`);
          }else if (res.status===200){
            setSnackBarMsg(`Saved changes to region with ID ${res.data.id} and regionName = ${res.data.regionName}`);
          }else{
            setSnackBarMsg('Something went wrong.');
          }
          setOpen(true);
    }
    
    useEffect(()=>{
        if (regionId && match.path===curEditModePath){
           const getData = async () => {
                const regionToEdit = await getDataFromServer({route:'regions',id:regionId});
                console.log(regionToEdit.regionname);
                setRegionData(regionToEdit.regionname);
            }
            getData()
        }
    },[regionId,match.path]);
    if (!isLoggedIn)return <div style={{display: 'flex', justifyContent: 'center'}}>No login</div>
    return (<>      <Container maxWidth='md'>
    <Typography variant='h4' align='center' color='textPrimary' gutterBottom>
        {regionId && match.path===curEditModePath? 'Edit region' : 'Add new region'}
    </Typography>
  </Container>
  <Container maxWidth='md' className={classes.cardGrid} >
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
        <form onSubmit={clickSubmit}>
            <input type='text' placeholder='Region name' value={regionData} onChange={(e)=>setRegionData(e.target.value)} />
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

export default RegionEditor