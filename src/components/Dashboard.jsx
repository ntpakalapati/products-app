import { useState, useEffect, useContext, useRef } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Card, Link, Typography, Stack, CardActionArea, Grid, alpha, TextField, IconButton, DialogContent, CssBaseline, DialogTitle, Dialog, Button, Avatar, Menu, Fade, MenuItem, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { fCurrency } from '../service/utils';
import axios from 'axios';
import { Container } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import { getEmailFromToken } from '../service/jwt'
import { Logout } from '@mui/icons-material';

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

export default function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([])
  const [email, setEmail] = useState("")
  const [open, setOpen] = useState(false);
  const [formData, updateFormData] = useState({ "name": "", "description": "", "price": "", 'status': "" });

  useEffect(() => {
    loadData()
  }, []);

  const loadData = async () => {
    const emailId = await getEmailFromToken()
    setEmail(emailId)
    await axios.get("http://localhost:8000/products")
      .then(async (response) => {
        console.log(response)
        setProducts(response.data.rows)
      }).catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage)
      });
  }

  function handleClose() {
    setOpen(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    formData['id'] = products.length + 1;
    formData['image'] = file;
    console.log(formData)
    await axios.post('http://localhost:8000/addproduct', formData, {
      body: JSON.stringify(formData)
    }).then((obj) => {
      console.log(obj)
      setOpen(false);
      loadData();
    }).catch(function (error) {
      console.log(error);
    });
  };


  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim()
    });
  };

  const anchorRef = useRef(null);

  const [opens, setOpens] = useState(null);
  const openMenu = Boolean(opens);
  const handleOpens = (event) => {
    setOpens(event.currentTarget);
  };

  const handleCloses = () => {
    setOpens(null);
  };

  const [file, setFile] = useState();
  function handleChangeImg(e) {
      console.log(e.target.files);
      setFile(URL.createObjectURL(e.target.files[0]));
  }

  const logout = () => {
    localStorage.clear();
    navigate('/login')
  }

  return (
    <div> {
      email ?
        <Container>
          <IconButton
            ref={anchorRef}
            onClick={handleOpens}
            sx={{
              p: 0,
              ...(open && {
                '&:before': {
                  zIndex: 1,
                  content: "''",
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  alignItems: 'flex-end',
                  bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
                },
              }),
            }}
          >
            <Avatar src="https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg" alt="photoURL" />
          </IconButton>
          <Menu
            id="fade-menu"
            MenuListProps={{
              'aria-labelledby': 'fade-button',
            }}
            anchorEl={opens}
            open={openMenu}
            onClose={handleCloses}
            TransitionComponent={Fade}
          >
            <Box sx={{ my: 1.5, px: 2.5 }}>
              <Typography variant="subtitle2" noWrap>
                {email}
              </Typography>
            </Box>

            <Divider sx={{ borderStyle: 'dashed' }} />
            <MenuItem onClick={() => logout()}>Logout</MenuItem>
          </Menu>
          <Stack spacing={2} sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h4" sx={{ mb: 5 }}>
                Products
              </Typography>
              <Button
                onClick={() => setOpen(true)}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Add Product
              </Button>
            </Stack>
          </Stack>


          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid key={product.id} item xs={12} sm={6} md={3}>
                <Card>
                  <Box sx={{ pt: '50%', position: 'relative' }}>
                    <ProductImgStyle alt={product?.name} src={product?.image} />
                  </Box>

                  <Stack spacing={2} sx={{ p: 3 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="subtitle2" noWrap>
                        {product?.name}
                      </Typography>
                      <Typography variant="subtitle1">
                        {product?.price}
                      </Typography>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container> :
        navigate('/login')
    }

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          <Grid container
            direction="row"
            justifyContent="space-between"
            alignItems="center">
            <Typography color="primary">Product Details </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleClose}
              color="primary"
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Product Name"
                  name="name"
                  autoFocus
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="description"
                  label="Description"
                  name="description"
                  autoFocus
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="price"
                  label="Product Price"
                  name="price"
                  autoFocus
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="status"
                  label="Status"
                  name="status"
                  autoFocus
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                {/* <input
                  style={{ display: 'none' }}
                  id="image"
                  name="image"
                  type="file"
                  onChange={handleChange}
                /> */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Product Image"
                  name="image"
                  type="file"
                  id="image"
                  onChange={handleChangeImg}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  onClick={handleSubmit}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Add Product
                </Button>
              </Grid>

            </Grid>
          </Container>
        </DialogContent>
      </Dialog>
    </div>
  );
}