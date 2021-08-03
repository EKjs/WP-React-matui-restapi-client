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

const CategoryEditor = () => {
    const {isLoggedIn} = useContext(LoginContext);
    const classes = useStyles();
    const curEditModePath="/editcategory/:categoryId";
    const match = useRouteMatch();
    const {categoryId} = useParams();
    const [categoryData,setCategoryData] = useState('');

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
        setCategoryData('');
        let route='categories/';
        let reqMethod='POST';

        if (categoryId && match.path===curEditModePath){
            route+=categoryId;
            reqMethod='PUT';
        }

        const res = await sendDataToServer({route:route,reqMethod:reqMethod,reqBody:{category:categoryData}});

        if (res.status===201){
            setSnackBarMsg(`Added a new category with ID ${res.data.id} and category = ${res.data.category}`);
          }else if (res.status===200){
            setSnackBarMsg(`Saved changes to category with ID ${res.data.id} and category = ${res.data.category}`);
          }else{
            setSnackBarMsg('Something went wrong.');
          }
          setOpen(true);
    }
    
    useEffect(()=>{
        if (categoryId && match.path===curEditModePath){
           const getData = async () => {
                const categoryToEdit = await getDataFromServer({route:'categories',id:categoryId});
                console.log(categoryToEdit.category);
                setCategoryData(categoryToEdit.category);
            }
            getData()
        }
    },[categoryId,match.path]);
    if (!isLoggedIn)return <div style={{display: 'flex', justifyContent: 'center'}}>No login</div>
    return (<>
        <Container maxWidth='md'>
        <Typography variant='h4' align='center' color='textPrimary' gutterBottom>
            {categoryId && match.path===curEditModePath? 'Edit category' : 'Add new category'}
        </Typography>
      </Container>
      <Container maxWidth='md' className={classes.cardGrid} >
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
                <form onSubmit={clickSubmit}>
                    <input type='text' placeholder='Category name' value={categoryData} onChange={(e)=>setCategoryData(e.target.value)} />
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

export default CategoryEditor