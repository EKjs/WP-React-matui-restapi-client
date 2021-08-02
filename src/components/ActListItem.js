import { Link } from "react-router-dom"
import { Grid, Card, CardMedia, CardContent, Typography, Chip, CardActions, CardHeader } from "@material-ui/core";
import useStyles from "../styles";

  

const ActListItem = ({id,description,activityName,address,coords,picture,time,age,subCategoryId,subCategory,categoryId,category,cityId,cityName,regionId,regionName,durationId,durationText}) => {
    const classes = useStyles();
    console.log(picture);

    return (<>
<Grid item xs={12} sm={6} md={4}>
    <Card className={classes.card}>
    <CardHeader
        title={subCategory}
        subheader={cityName}
      />
        <CardMedia 
        className={classes.cardMedia}
        image={picture}
        title={activityName}
        component={Link} to={`/activities/${id}`}
        />
        <CardContent className={classes.cardContent}>
            <Typography gutterBottom variant='h6'>
                <Link className={classes.notALink} to={`/activities/${id}`}>{activityName}</Link>
            </Typography>
            <Typography variant="subtitle1">
                {description}
            </Typography>
            <Typography variant="body2"  color="textSecondary">
                {time && <>Time information: {time}</>} <br/>
                {age===0 || !age ? <>Minimal age not set</> : <>Minimal age {age}</>}    
            </Typography>
            <Typography variant="body2">
                Address: {address},<br/>
                <Link className={classes.notALink} to={`/activities/cities/${cityId}`}>{cityName}</Link>,{' '}
                <Link className={classes.notALink} to={`/activities/regions/${regionId}`}>{regionName}</Link>
            </Typography>

        </CardContent>
        <CardActions>
            <Chip clickable variant="outlined" color="primary" size="small" label={subCategory} component={Link} to={`/activities/subcategories/${subCategoryId}`} />
            <Chip clickable variant="outlined" color="primary" size="small" label={category} component={Link} to={`/activities/categories/${categoryId}`} />
            <Chip clickable variant="outlined" color="primary" size="small" label={durationText} component={Link} to={`/activities/durations/${durationId}`} />
        </CardActions>

    </Card>

</Grid>


        </>)
}
export default ActListItem

