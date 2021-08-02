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

const SubCategotyEditor = () => {
    const classes = useStyles();
    const curEditModePath="/editsubcategory/:subCategoryId";
    const match = useRouteMatch();
    const {subCategoryId} = useParams();
    const [categoriesList,setCategoriesList] = useState('');
    const [subCategory,setSubCategory] = useState('');
    const [curCategory,setCurCategory] = useState();

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
        setSubCategory('');
        let route='subcategories/';
        let reqMethod='POST';

        if (subCategoryId && match.path===curEditModePath){
            route+=subCategoryId;
            reqMethod='PUT';
        }

        const res = await sendDataToServer({route:route,reqMethod:reqMethod,reqBody:{subCategoryName:subCategory,catId:curCategory}});

        if (res.status===201){
            setSnackBarMsg(`Added a new sub-category with ID ${res.data.id}, catid = ${res.data.catId} and subcategory = ${res.data.subCategory}`);
          }else if (res.status===200){
            setSnackBarMsg(`Saved changes to sub-category with ID ${res.data.id}, catid = ${res.data.catId}  and subcategory = ${res.data.subCategory}`);
          }else{
            setSnackBarMsg('Something went wrong.');
          }
          setOpen(true);
    }

    
    useEffect(()=>{
        const getAllCategories = async () => {
            const resCategories = await getDataFromServer({route:'categories'});
            setCategoriesList(resCategories.items);
            if (subCategoryId && match.path===curEditModePath){ //Edit mode
                const resSubCat = await getDataFromServer({route:'subcategories',id:subCategoryId});
                setSubCategory(resSubCat.subcategory);
                setCurCategory(resSubCat.catid);
            }else{ //Add new mode
                setCurCategory(resCategories.items[0].id);
            }
        }
        getAllCategories()
    },[subCategoryId,match.path])

    if (!categoriesList)return <p>Loading...</p>
    return (<>      <Container maxWidth='md'>
    <Typography variant='h4' align='center' color='textPrimary' gutterBottom>
        {subCategoryId && match.path===curEditModePath? 'Edit sub-category' : 'Add new sub-category'}
    </Typography>
  </Container>
  <Container maxWidth='md' className={classes.cardGrid} >
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
        <form onSubmit={clickSubmit}>
            <select name='categories' onChange={(e)=>{setCurCategory(parseInt(e.target.value))}} value={curCategory} >
                {categoriesList.map(categ=><option key={`categKey${categ.id}`} value={categ.id}>{categ.category}</option>)}
            </select><br/>
            <input type='text' placeholder='Sub category' value={subCategory} onChange={(e)=>setSubCategory(e.target.value)} />
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

export default SubCategotyEditor