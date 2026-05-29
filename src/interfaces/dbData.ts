export interface ApiData {
  _id:               string;
  accountAddress:    string;
  actualizadoPor:    string;
  beforeAfter:       BeforeAfter[];
  businessAddress:   string;
  businessLicense:   string;
  colors:            Colors;
  creadoPor:         string;
  createdAt:         Date;
  dataGeneral:       DataGeneral;
  directorios:       Directorio[];
  domain:            string;
  estimateFree:      string;
  existingWebsite:   string;
  gallery:           string[];
  gmb:               string;
  landingLocations:  any[];
  landingsGallery:   LandingsGallery[];
  languages:         string;
  logos:             Logos;
  methodsPayment:    string;
  milesCover:        string;
  name:              string;
  nameCustomers:     string;
  redesSociales:     Directorio[];
  reviews:           Reviews;
  sectionsHomeAbout: SectionsHomeAbout[];
  services:          Service[];
  slogan:            string[];
  updatedAt:         Date;
  valuesContent:     ValuesContent;
  videoAnimado:      VideoAnimado[];
  widgets:           { [key: string]: boolean };
  yearsExperience:   string;
 }

 export interface BeforeAfter {
  _id:       string;
  afterImg:  Img;
  beforeImg: Img;
  title:     string;
 }
 
 export interface Img {
  images:     string;
  tipoImages: string;
 }
 
 export interface Colors {
  btnColor:       string;
  btnHoverColor:  string;
  fourthColor:    string;
  primaryColor:   string;
  secondaryColor: string;
  tertiaryColor:  string;
  textColor:      string;
  titleColor:     string;
 }

 export type SocialMedia = {
  _id: string;
  name: string;
  icon: string;
  logo: string;
  link: string;
}
 
 export interface DataGeneral {
  emails:       Email[];
  location:     Location[];
  openingHours: OpeningHour[];
  phones:       Phone[];
 }
 
 export interface Email {
  _id:   string;
  email: string;
  title: string;
 }
 
 export interface Location {
  _id:     string;
  city:    string;
  urlCity: string;
 }
 
 export interface OpeningHour {
  _id:   string;
  days:  string;
  hours: string;
 }
 
 export interface Phone {
  _id:    string;
  number: string;
  title:  string;
 }
 
 export interface Directorio {
  _id:  string;
  icon: string;
  link: string;
  logo: string;
  name: string;
 }
 
 export interface LandingsGallery {
  _id:         string;
  imgLanding:  string[];
  nameLanding: string;
 }
 
 export interface Logos {
  favicon:   string;
  primary:   string;
  secondary: string;
 }
 
 export interface Reviews {
  stateReviews: boolean;
  urlReviews:   string;
  viewAll:      boolean;
  viewHome:     boolean;
 }
 
 export interface SectionsHomeAbout {
  _id:              string;
  additionalImages: string[];
  list:             any[];
  section:          Section;
  text:             string;
  tipos:            string;
  title:            string;
 }
 
 export enum Section {
  About = "about",
  Blocks = "blocks",
  Home = "home",
 }
 
 export interface Service {
  _id:           string;
  description:   Description[];
  showtitletext: boolean;
  subtitle:      string;
  title:         string;
 }
 
 export interface Description {
  _id:        string;
  image:      string;
  precio:     string;
  text:       string;
  tipoImages: string;
 }
 
 export interface ValuesContent {
  additionalImages: string[];
  mission:          string;
  vision:           string;
  whychooseUs:      string;
 }
 
 export interface VideoAnimado {
  _id:        string;
  stateVideo: boolean;
  titleVideo: string;
  typeCanal:  string;
  urlVideo:   string;
 }
 
 export interface LandingLocation {
  title: string;
  subtitle: string;
  keywords: string;
  seoTitle: string;
  slug: string;
  metadescription: string;
  feactureimage: string;
  date?: Date | string; // Use string if the date is in ISO format
  category: string;
  autor: string;
  description: DescriptionLocations[];
}
interface DescriptionLocations {
  title: string;
  subtitle: string;
  image: string;
  text: string;
  textbutton: string;
}