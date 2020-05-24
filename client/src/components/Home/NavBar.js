// Import modules and files
import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HomeStyle.css";
import Cookies from "universal-cookie";
import axios from "axios";
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

export default class NavBar extends Component {
  constructor(props) {
    const cookies = new Cookies();
    let user = cookies.get("user");
    super(props);

    this.state = {
      user: user,
      Subtype: "",
      Images: [],
      Wishlist: [],
      category: [],
      product: [],
      Search: '',
      showSearch: false,
      itemCount: 0,
      cartCount: 0,
    };

    this.btnLinks = this.btnLinks.bind(this);
    this.displayHistory = this.displayHistory.bind(this);
  }

  // Handle signout: chamil
  onClickSignOut = (e) => {
    e.preventDefault();

    console.log("Signout");
    const cookies = new Cookies();

    const obj = {
      token: cookies.get("token"),
      user: cookies.get("user"),
    };

    axios.post("/user/sign-out", obj).then(
      (response) => {
        const cookies = new Cookies();
        cookies.remove("token");
        cookies.remove("user");
        window.location.href = "/sign-in";

        // if( window.location.path === "http://localhost:3000/log"){
        //     console.log('inside if')
        //     window.location.path = "/";
        // }
      },
      (error) => {
        cookies.remove("token");
        cookies.remove("user");
        window.location.href = "/";
      }
    );
  };

  componentDidMount() {
    const cookies = new Cookies();
    let user = cookies.get("user");

    axios
      .get("/category/")
      .then((response) => {
        this.setState({ category: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get("/product/")
      .then((response) => {
        this.setState({ product: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });

    // Method for get the item count of wishlist
    if (user) {
      axios
        .get("/wishlist/getcount/" + user.userId)
        .then((response) => {
          this.setState({ itemCount: response.data });
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    if (user) {
      axios
        .get("/cart/getcount/" + user.userId)
        .then((response) => {
          this.setState({ cartCount: response.data });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  // Navigate to wishlist
  btnLinks() {
    const cookies = new Cookies();
    let user = cookies.get("user");

    return (
      <Button variant="outline-dark" className="float-right mr-4 mb-4 mt-4 wishlist-btn"
        onClick={() => {
          if (user) {
            window.location.href = "/wishlist";
          } else {
            alert("Please Login First..!");
            window.location.href = "/sign-in";
          }
        }}>
         <Badge className="mr-1" variant="info" pill><p>{this.state.itemCount}</p></Badge> Wish List <i class="fas fa-heart" />
      </Button>
    );
  }

  // Display purchase history link
  displayHistory() {
    const cookies = new Cookies();
    let user = cookies.get("user");

    return user ? (
      <Nav.Link href="/orderhistory">Purchase History</Nav.Link>
    ) : ("");
  }

  // Get the dropdown value
  onChangeCategory(e) {
    this.setState({
      category: e.target.value,
    });
  }

  render() {
    return (
      <div>
        <Navbar bg="light" expand="lg">
          <Link to="/">
            <Navbar.Brand href="#home">
              CSKP <span className="logo-subhead">Fashion Store</span>
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <NavDropdown
                title="Categories"
                id="basic-nav-dropdown"
                value={this.state.category}
                onChange={this.onChangeCategory}
              >
                {this.state.category.map(function (category) {
                  return (
                    <NavDropdown.Item href={"/items/" + category._id}>
                      {category.CategoryType}
                    </NavDropdown.Item>
                  );
                })}
              </NavDropdown>

              <Nav.Link href="/delivery">Delivery</Nav.Link>
              <Nav.Link href="/sizeguide">Size Guide</Nav.Link>
              <a href="/about">About Us</a>
              {this.displayHistory()}
            </Nav>

            {this.state.user ? (
              <Nav>
                <NavDropdown
                  title={this.state.user ? this.state.user.username : "Sign In"}
                  id="collasible-nav-dropdown"
                >
                  <NavDropdown.Item onClick={this.onClickSignOut}>
                    <div>
                      <span>Logout</span>
                    </div>
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            ) : (
                <Nav.Link href="/sign-in">
                  <i class="fas fa-user mr-2" />{" "}
                  {this.state.user ? this.state.user.username : "Sign In"}
                </Nav.Link>
              )}

            <Form inline onSubmit={this.clickSearch}>
              <FormControl type="text" placeholder="Search..." value={this.state.Search} onChange={this.onChangeSearch} className="mr-sm-2" />
              <Button variant="outline-dark mt-2">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Navbar>
        {this.btnLinks()}
        <Link to="/cartview">
          <Button
            variant="outline-dark"
            className="float-right mr-4 mb-4 mt-4 wishlist-btn"
            onClick={() => {
              console.log("Hello");
            }}
          >
            <Badge className="mr-2" variant="info" pill><p>{this.state.cartCount}</p> </Badge> Shopping Cart <i class="fas fa-shopping-cart" />
          </Button>{" "}
        </Link>
      </div>
    );
  }
}
