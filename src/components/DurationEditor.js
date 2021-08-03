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

const DurationEditor = () => {
  const {isLoggedIn} = useContext(LoginContext);
    const classes = useStyles();
    const curEditModePath="/editduration/:durationId";
    const match = useRouteMatch();
    const {durationId} = useParams();
    const [durationData,setDurationData] = useState('');

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
        setDurationData('');
        let route='duration/';
        let reqMethod='POST';

        if (durationId && match.path===curEditModePath){
            route+=durationId;
            reqMethod='PUT';
        }

        const res = await sendDataToServer({route:route,reqMethod:reqMethod,reqBody:{durationText:durationData}});

        if (res.status===201){
            setSnackBarMsg(`Added a new duration with ID ${res.data.id} and durationtext = ${res.data.durationtext}`);
          }else if (res.status===200){
            setSnackBarMsg(`Saved changes to duration with ID ${res.data.id} and durationtext = ${res.data.durationtext}`);
          }else{
            setSnackBarMsg('Something went wrong.');
          }
          setOpen(true);
    }
    
    useEffect(()=>{
        if (durationId && match.path===curEditModePath){
           const getData = async () => {
                const durationToEdit = await getDataFromServer({route:'duration',id:durationId});
                console.log(durationToEdit.durationtext);
                setDurationData(durationToEdit.durationtext);
            }
            getData()
        }
    },[durationId,match.path]);
    if (!isLoggedIn)return <div style={{display: 'flex', justifyContent: 'center'}}>No login</div>
    return ( <>      <Container maxWidth='md'>
    <Typography variant='h4' align='center' color='textPrimary' gutterBottom>
        {durationId && match.path===curEditModePath? 'Edit duration' : 'Add new duration'}
    </Typography>
  </Container>
  <Container maxWidth='md' className={classes.cardGrid} >
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
        <form onSubmit={clickSubmit}>
            <input type='text' placeholder='Duration text' value={durationData} onChange={(e)=>setDurationData(e.target.value)} />
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

export default DurationEditor