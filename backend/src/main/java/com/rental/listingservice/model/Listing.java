package com.rental.listingservice.model;

public class Listing {
   private String id;
    private String source;
    private String address;
    private String city;
    private String state;
    private String zip;
    private double price;
    private int bedrooms;
    private double bathrooms;
    private int sqft;
    private double latitude;
    private double longitude;
    private String listedDate;
    private String status;
    private String description;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getZip() { return zip; }
    public void setZip(String zip) { this.zip = zip; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public int getBedrooms() { return bedrooms; }
    public void setBedrooms(int bedrooms) { this.bedrooms = bedrooms; }
    public double getBathrooms() { return bathrooms; }
    public void setBathrooms(double bathrooms) { this.bathrooms = bathrooms; }
    public int getSqft() { return sqft; }
    public void setSqft(int sqft) { this.sqft = sqft; }
    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }
    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
    public String getListedDate() { return listedDate; }
    public void setListedDate(String listedDate) { this.listedDate = listedDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
