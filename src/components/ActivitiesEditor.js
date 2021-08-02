import { useState, useEffect, useCallback } from 'react';
//import useMyApi from "../hooks/useMyApi";
import { sendDataToServer, getDataFromServer } from "./DataSender";
import { Map, Draggable } from "pigeon-maps"
import { useRouteMatch } from "react-router-dom";
import { useParams } from "react-router";
import {Typography, Grid,Container} from '@material-ui/core';
//import Pagination from '@material-ui/lab/Pagination';
import useStyles from "../styles";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const ActivitiesEditor = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);//snackbar
  const [snackBarMsg, setSnackBarMsg] = useState('');//snackbar

  const curEditModePath="/editactivity/:editId";
  const match = useRouteMatch();
  const {editId} = useParams();

  const [loading,setLoading]=useState(true);

  const defaultDataFromSrv = {
    citiesArray:[],
    regionsArray:[],
    categoriesArray:[],
    subCategoriesArray:[],
    durationsArray:[]
  }
  const defaultActivityData = {
    activityName:'',
    description:'',
    address:'',
    city:0,
    coords:[],
    picture:[],
    subCategory:0,
    duration:'',
    time:'',
    age:0,
  }
  const [activityData,setActivityData]=useState(defaultActivityData);
  const [dataFromSrv,setDataFromSrv]=useState(defaultDataFromSrv);

  const [coords,setCoords]=useState([52.49796819666471, 13.437135340881355]);
  const [curRegion,setCurRegion]=useState();
  const [curRegionCities,setCurRegionCities]=useState();
  //const [curCity,setCurCity]=useState();

  const [curCategory,setCurCategory]=useState();
  const [curSubCatItems,setCurSubCatItems]=useState();
  //const [curSubCategory,setCurSubCategory]=useState();

  //const [pictureUrlArray,setPictureUrlArray]=useState([]); //the array
  const [pictureUrl,setPictureUrl]=useState(''); //the text input


  const handleClose = (event, reason) => {//snackbar
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };


  const getCurRegionCities = useCallback((newRegion) => {
    try {
        console.log('searching',newRegion);
        const citiesOfRegion=dataFromSrv.citiesArray.filter(city=>city.regionId===newRegion);
        setCurRegionCities(citiesOfRegion);
        if (citiesOfRegion.length>0){
          if (citiesOfRegion.every(ct=>ct.id!==activityData.city)){//if we changed the region we should update current city
            console.log('Changing city');
            setActivityData(prev=>{
              const newData={...prev};
              newData.city=citiesOfRegion[0].id;
              return newData
            });
          }
        }
    } catch (error) {
        console.log(error);
    }
  },[dataFromSrv,activityData.city]);

  const getCurCategorySubCats = useCallback((newCat) => {
    try {
        const subCatsOfCat=dataFromSrv.subCategoriesArray.filter(subCat=>subCat.catId===newCat);
        setCurSubCatItems(subCatsOfCat);
         if (subCatsOfCat.length>0){
          if (subCatsOfCat.every(ct=>ct.id!==activityData.subCategory)){
            console.log('Changing sub category');
            setActivityData(prev=>{
              const newData={...prev};
              newData.subCategory=subCatsOfCat[0].id;
              return newData
            });
          }
        }

    } catch (error) {
        console.log(error);
    }
  },[dataFromSrv,activityData.subCategory]);

  const clickSubmit = async (e) => {
    e.preventDefault();
    console.log(activityData);
    let route='activities/';
    let reqMethod='POST';

    if (editId && match.path===curEditModePath){
        route+=editId;
        reqMethod='PUT';
    }
    console.log(coords);
    const res = await sendDataToServer({route:route,reqMethod:reqMethod,reqBody:{...activityData,coords:coords}});

    if (res.status===201){
      setSnackBarMsg(`Added a new activity with ID ${res.data.id} and title = ${res.data.activityName}.`)
    }else if (res.status===200){
      setSnackBarMsg(`Saved changes to activity with ID ${res.data.id} and title = ${res.data.activityName}.`);
    }else{
      setSnackBarMsg('Something went wrong.');
    }
    setOpen(true);
  };

  //Adding and deleting picture URLs
  const addToUrls = (e) => {
    e.preventDefault();
    setActivityData(prev=>{
      const newData={...prev};
      newData.picture=[...prev.picture,pictureUrl];
      return newData
    });
    setPictureUrl('');
  };

  const deleteFromUrls = (e) => {
    e.preventDefault();
    const indexToDelete=parseInt(e.target.value);
    setActivityData(prev=>{
      const newData={...prev};
      const tempArr = [...prev.picture];
      tempArr.splice(indexToDelete,1);
      newData.picture=tempArr;
      return newData
    });
  };

  useEffect(()=>{
    const getDataFromSrv = async () => {
      setLoading(true);
      const resCategories = await getDataFromServer({route:'categories'});
      const resSubCategories = await getDataFromServer({route:'subcategories'});
      const resCities = await getDataFromServer({route:'cities'});
      const resRegions = await getDataFromServer({route:'regions'});
      const resDurations = await getDataFromServer({route:'duration'});
      setDataFromSrv({
        citiesArray:resCities.items,
        regionsArray:resRegions.items,
        categoriesArray:resCategories.items,
        subCategoriesArray:resSubCategories.items,
        durationsArray:resDurations.items
      });
      

      if (editId && match.path===curEditModePath){ //Edit mode
        const resActivityToEdit = await getDataFromServer({route:'activities',id:editId});
        setActivityData({
          activityName:resActivityToEdit.activityName || "",
          description:resActivityToEdit.description || "",
          address:resActivityToEdit.address || "",
          city:resActivityToEdit.cityId,
          coords:resActivityToEdit.coords,
          picture:resActivityToEdit.picture,
          subCategory:resActivityToEdit.subCategoryId,
          duration:resActivityToEdit.durationId,
          time:resActivityToEdit.time || "",
          age:resActivityToEdit.age || 0,
        });
        setCoords(resActivityToEdit.coords);
        setCurRegion(resActivityToEdit.regionId);
        //getCurRegionCities(resActivityToEdit.regionId);

        setCurCategory(resActivityToEdit.categoryId);
        //getCurCategorySubCats(resActivityToEdit.cityId);
      }else{ //Add new mode
        
        setCurRegion(resCities.items[0].regionId);
        //getCurRegionCities(resCities.items[0].regionId);

        setCurCategory(resSubCategories.items[0].catId);
        //getCurCategorySubCats(resSubCategories.items[0].catId);

        setActivityData(prev=>{
          const newData=prev;
          newData.city=resCities.items[0].id;
          newData.subCategory=resSubCategories.items[0].id;
          newData.duration=resDurations.items[0].id;
          return newData
        });
      };
      setLoading(false);
    }
    getDataFromSrv();
    console.log('starting useEffect');
  },[editId,match.path]);

  useEffect(()=>{
    getCurRegionCities(curRegion);
  },[curRegion,getCurRegionCities]);
  useEffect(()=>{
    getCurCategorySubCats(curCategory);
  },[curCategory,getCurCategorySubCats]);

  const changeInputs = (e) => {
    console.log('changing inputs');
    const inpNm=e.target.name;
    const val=inpNm==='age' || inpNm==='city' || inpNm==='duration' || inpNm==='subCategory' ? parseInt(e.target.value) : e.target.value;
    console.log(inpNm,val);

    setActivityData(prev=>{
      const newData={...prev};
      newData[inpNm] = val
      return newData
    })
  };

  if(loading)return (<>loading</>)
    
return (<>
  <Container maxWidth='md'>
    <Typography variant='h4' align='center' color='textPrimary' gutterBottom>
        {editId && match.path===curEditModePath ? 'Edit activity' : 'Add new activity'}
    </Typography>
  </Container>
  <Container maxWidth='md' className={classes.cardGrid} >
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Map height={400} defaultCenter={coords} defaultZoom={11}>
            <Draggable offset={[60, 87]} anchor={coords} onDragEnd={setCoords}>
              <img src="/map-marker.png" width={50} height={50} alt="Marker" />
            </Draggable>
          </Map>
        </Grid>
        <Grid item xs={12} sm={6}>
          <form>
              <input type="text" placeholder="Activity title" name="activityName" onChange={changeInputs} value={activityData.activityName}/><br/>
              <input type="text" placeholder="Activity address" name="address" onChange={changeInputs} value={activityData.address}/><br/>
              <input type="text" placeholder="Activity time" name="time" onChange={changeInputs} value={activityData.time}/><br/>
              <input type="number" placeholder="Activity age" name="age" onChange={changeInputs} value={activityData.age}/><br/>
              <textarea name="description" placeholder="Activity description" onChange={changeInputs} rows="5" cols="29" defaultValue={activityData.description}></textarea>
              <hr/>
              <select name='region' onChange={(e)=>{setCurRegion(parseInt(e.target.value))}} value={curRegion}>
                  {dataFromSrv.regionsArray.map(region=><option key={`regionKey${region.id}`} value={region.id}>{region.regionName}</option>)}
              </select><br/>
              <select name='city' onChange={changeInputs} value={activityData.city}>
                  {curRegionCities.map(city=><option key={`cityKey${city.id}`} value={city.id}>{city.name}</option>)}
              </select><br/>
              <hr/>
              <select name='category' onChange={(e)=>{setCurCategory(parseInt(e.target.value))}} value={curCategory}>
                  {dataFromSrv.categoriesArray.map(category=><option key={`categoryKey${category.id}`} value={category.id}>{category.category}</option>)}
              </select><br/>
              <select name='subCategory' onChange={changeInputs} value={activityData.subCategory}>
                  {curSubCatItems.map(subCat=><option key={`subCatKey${subCat.id}`} value={subCat.id}>{subCat.subCategory}</option>)}
              </select><br/>
              <hr/>
              <select name='duration' onChange={changeInputs} value={activityData.duration}>
                  {dataFromSrv.durationsArray.map(duration=><option key={`durationKey${duration.id}`} value={duration.id}>{duration.durationText}</option>)}
              </select>
              <hr/>
              <input type="text" placeholder="Picture URL" name="picture" value={pictureUrl} onChange={(e)=>setPictureUrl(e.target.value)} /><button onClick={addToUrls}>+</button><br/>
              {activityData.picture.map((v,i)=><p key={`picU${i}`}>{v} <button value={i} onClick={deleteFromUrls}>-</button></p>)}
          </form> 
        </Grid>
      </Grid>
      <Grid container spacing={4} align="center">
        <Grid item xs={12} sm={6}>
          <button onClick={clickSubmit}>{editId && match.path===curEditModePath ? 'Save changes' : 'Add activity'}</button>
        </Grid>
      </Grid>
  </Container>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          {snackBarMsg}
        </Alert>
      </Snackbar>
</>)
};

export default ActivitiesEditor