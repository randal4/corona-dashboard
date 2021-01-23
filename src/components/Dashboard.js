import React, { useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import StatsGrid from "./StatsGrid";
import MapChart from "./MapChart";
import CountryDetails from "./CountryDetails";
import ReactTooltip from "react-tooltip";
import axios from "axios";
import countryData from "./data/countryData.json";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        {" "}
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  title: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 640,
  },
}));

export default function Dashboard() {
  const classes = useStyles();

  const [loading, setLoading] = React.useState(true);
  const [rawData, setRawData] = React.useState();
  const [selectedCountryData, setSelectedCountryData] = React.useState();
  const [tooltipContent, setTooltipContent] = React.useState("");

  useEffect(() => {
    /* const fetchData = async () => {
      const result = await axios(
        "https://corona-virus-stats.herokuapp.com/api/v1/cases/countries-search?limit=220&page=1"
      );

      setRawData(result.data);
      setLoading(false);
    };

    fetchData(); */
    setRawData(countryData);
    setLoading(false);
  }, []);

  useEffect(() => {
    rawData &&
      setSelectedCountryData(
        rawData.data.rows.find((data) => data.country === "World")
      );
  }, [rawData]);

  const handleCountryClick = (geo) => {
    setSelectedCountryData(
      rawData.data.rows.find(
        (country) => country.country_abbreviation === geo.ISO_A2
      )
    );
  };

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return loading ? (
    "Loading..."
  ) : (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Covid-19 Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                {/*<Chart />*/}
                <div>
                  <MapChart
                    handleCountryClick={handleCountryClick}
                    setTooltipContent={setTooltipContent}
                    loading={loading}
                    data={rawData.data.rows}
                  />
                  <ReactTooltip>{tooltipContent}</ReactTooltip>
                </div>
              </Paper>
            </Grid>
            {/* Country Details */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <CountryDetails data={selectedCountryData} />
              </Paper>
            </Grid>
            {/* Stats */}
            <Grid item xs={12}>
              <Paper className={fixedHeightPaper}>
                <StatsGrid data={rawData.data} loading={loading} />
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}
