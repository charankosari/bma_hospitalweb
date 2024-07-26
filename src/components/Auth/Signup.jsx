import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LandingPage from '../common/LandingPage'; // Import your LandingPage component

const steps = ['Basic Info', 'Address Info', 'Upload Image & Set Location'];

function RegisterScreen({ toggleSignup, toggleMobile }) {
  const [activeStep, setActiveStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState(17.38714);
  const [longitude, setLongitude] = useState(78.491684);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleRegister();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleRegister = async () => {
    setLoading(true);
    let imageUrl = '';

    try {
      if (image) {
        const formData = new FormData();
        formData.append('file', image);

        const response = await fetch('https://server.bookmyappointments.in/api/bma/hospital/profileupload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (response.status !== 200) {
          throw new Error(data.error || 'Failed to upload image');
        }
        imageUrl = data.url;
      }

      const body = {
        hospitalName: name,
        address: {
          hospitalAddress: address,
          pincode,
          city,
          latitude,
          longitude,
        },
        number: phoneNumber,
        email,
        image: imageUrl,
      };

      const response = await fetch('https://server.bookmyappointments.in/api/bma/hospital/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.status === 200) {
        alert('Registration successful');
        toggleSignup();
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Failed to register, please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
      },
    });

    useEffect(() => {
      map.setView([latitude, longitude], map.getZoom());
    }, [latitude, longitude, map]);

    return latitude === null ? null : (
      <Marker
        position={[latitude, longitude]}
        icon={new L.Icon({ iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png' })}
      />
    );
  }

  return (
    <Box
      sx={{
        position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(5px)', 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      }}
    >
      <Box
        sx={{
            borderRadius: '10px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            justifyContent:'center'
            
        }}
      />
      <Paper
        elevation={3}
        sx={{
          p: 3,
          maxWidth: '600px',
          width: '100%',
          position: 'relative',
          zIndex: 1,
       
        }}
      >
        <Typography component="h1" variant="h5" align="center" sx={{ color: '#2BB673' }}>
          Register
        </Typography>
        {/* <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel sx={{ color: '#2BB673' }}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper> */}
        <form>
          {activeStep === 0 && (
            <Box sx={{ mt: 2 }}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="phoneNumber"
                label="Phone Number"
                name="phoneNumber"
                autoComplete="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Box>
          )}
          {activeStep === 1 && (
            <Box sx={{ mt: 2 }}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="address"
                label="Address"
                name="address"
                autoComplete="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="pincode"
                label="Pincode"
                name="pincode"
                autoComplete="pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="city"
                label="City"
                name="city"
                autoComplete="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Box>
          )}
          {activeStep === 2 && (
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={handleOpenModal} sx={{ mb: 2, backgroundColor: '#2BB673', color: 'white' }}>
                Open Full-Screen Image Upload & Map
              </Button>
              {openModal && (
                <div
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                  }}
                >
                  <div
                    style={{
                      background: 'white',
                      borderRadius: '10px',
                      padding: '20px',
                      width: '80%',
                      height: '80%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                    }}
                  >
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleCloseModal}
                      style={{ position: 'absolute', top: '10px', right: '10px' }}
                    >
                      Close
                    </Button>
                    <Typography variant="h6">Upload Image</Typography>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ margin: '20px 0' }}
                    />
                    {image && (
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Selected"
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    )}
                    <Typography variant="h6" style={{ marginTop: '20px' }}>
                      Set Location on Map
                    </Typography>
                    <MapContainer center={[latitude, longitude]} zoom={13} style={{ width: '100%', height: '100%' }}>
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <LocationMarker />
                    </MapContainer>
                  </div>
                </div>
              )}
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep > 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              sx={{ backgroundColor: '#2BB673', color: 'white' }}
            >
              {loading ? <CircularProgress size={24} /> : activeStep === steps.length - 1 ? 'Register' : 'Next'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default RegisterScreen;