import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style/Profile.css";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  dept: string;
  gender: string;
  phoneNumber: number;
  skills: string[];
  bio: string;
  linkedIn: string;
  github: string;
  twitter: string;
  interests: string[];
  companyName: string;
  batch: number;
  role: string;
  userId: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false); // State to control edit dialog visibility
  const [formData, setFormData] = useState<User | null>(null); // State to store form data
  const [newSkill, setNewSkill] = useState<string>(""); // New skill input
  const [newInterest, setNewInterest] = useState<string>(""); // New interest input
  
  const fetchUserProfile = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) throw new Error("User not authenticated");
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load profile"
      );
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Open the edit dialog and pre-fill the form with user data
  const openEditDialog = () => {
    if (user) {
      const updatedUser = JSON.parse(localStorage.getItem("user")!);
      setUser(updatedUser);
      setFormData(updatedUser);
      setIsEditDialogOpen(true);
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData!,
      [name]: value,
    }));
  };

  // Handle form submission (update profile)
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        console.error("No user found in localStorage");
        setError("User not found, please log in again.");
        return;
      }
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.userId;
      console.log("User in localStorage:", localStorage.getItem("user"));
      console.log(userId);
      const response = await axios.patch(
        `http://localhost:8000/user/updateProfile/${userId}`,
        formData
      );

      // Update state and localStorage with the updated user data
      const updatedUser = response.data.userDetail;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser({ ...updatedUser });
      setIsEditDialogOpen(false);
      setError("");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!user) return <div className="no-data">No user data found</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img
          src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUTExMWFRUXFxcXFxcYFxUXGBcVFhcXFxcXFRcaHSggGBolGxcXITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGBAPFy0dHR0tLSstLS0tKy0tLSstLS0tKy0tLSstKy0tLSstLS0tLS0rKy0tLSstLS0tLS0tLS03Lf/AABEIALcBEwMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAAAQIDBAUGB//EAD4QAAEDAgMFBgQDBQgDAAAAAAEAAhEDIQQSMQVBUWFxBiKBkaGxE8HR8DJCUgcUYuHxIyQzcoKio7JDc8L/xAAYAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/EAB4RAQEBAQABBQEAAAAAAAAAAAABEQIhAxITMVFB/9oADAMBAAIRAxEAPwDyZxtzTA8p+See5MLCNyBznQb3SODTcT0kJImZGp/qhrOcDigCSNN6e8CE1zgN/wDK6dmkTMnx3oI2gxKlpN3lOpNFhIAi+/wjemF0FA1puhwhK2D1lBuY+4goD8PyTKZ7w6j3QU6mRbqEEdYQUtUmOiWqO96qN06IEK3Ox2AFbEtDgHMYC9wJtbSeN4ssNzSLELqKdUYfZtiBVxBNx+IU5jrED1QZfaHG/HxFV4Fi6B0AAn0WW1slObwQ7kgbmU9b/Dba0u8T3VAp8VMM4ZBHmc3+6fJBAUgTiEMagagpQJsiyBiCE4sTw4TMW4SgjcITYU7wDpYxfy3KAkX9EDUqRKgVNJSoKBpCQhOKQoGwhOSIL5dAgHVDOHrz0ulfH1THckDzrHsho3xPFRtIgyJ4Hhf7HiiY0QPjLdNDLwU9oMSPuE1/tvQK1Pewa8R5FQQnh6BBuT3Hz9lHO6deCsVnssA0c/mgYBaToo2ETwSh1o3fNI3jw1QSVW3nVRgJ1WJPVRVHRdBMaWd/DnwAFz6JcRVzzwGUN5NaIjlxVJuKO7eIPOUw1HdOSC41ggk7kgcNFUeDxIO9OZWQTQrO0mEP0IEANB/SAAD4xPiqmdafaS1bKTOWnTbI5MH9fFBnh90wi8pQUOQJKSUp0TUACgoSSgkekeAQCPHqrGHwNSp+Bsy6JsBPC+qnOzAxx+LVa0NF8pl2ugHFBmIC0a9RtUZaVLK1knOSS6P4zoOgVNrWSJJjfA9kEUJFbdUZJyCG2guu48zuHRNLqd7OnlAHSL+6CsiEEXslDSgTMhGTmEILlRpbAIII42Ka52nT1T8xGnXj1Q+TrYc7IIwN/PRIDxUtRrB+adLAH3MJmZvAj1lA+nEQkqQB1+ykbG6R14JHiR5oCmeKV7eHVRi0dFJm0n7lA3KmEqV1hbioteSBZvZACRtienySgiYQSON45n3UdUyI6p1RwnVWti0TVrsY25J8Ii/ogrU9l1TT+KGwzceQ3+aZSaN93TAAvP8AmncvZ8LgcrBSbTEZQL6AaaKtV7OYVl3UWZjeQIv7LjPV/XovoflePYim78WoPAzHCT4b1XaYM6/RembdoMFNzYETp6mB96rzvE4aCZtw6LfPXucu+PbVdjvNa+3n5qxMzDabZG+GNusQrQxtQPeSLCwvG4AHTotsIydVI525RhqTMgWE0pZQQOKBqV2qUwkEIJa+JeYBcYb+EaBvSFBKdmCQlAZjpNuG5KT7pMyA5A4NOqaE6rUkqPMUDzfcmAIzFJKB+QoTMyEFs1HQRYJA4nUpjinPED73oEBPH0SjTXloEl9U5yBI1vokI5lBKQIHtaMu+ZO/omGPsp7RY9fkkc1AgFv5pHADggEpCECkCyNNyRwReEAQr2wqTnV2NaDOstkFoFy4XFxz4qmTbqug7E7Ro4es+pWEtDJ11g6Dibiyl+l5813uMwVSrSbTZWqioyxqDulzZJGZoOoB4qts3s7isjXOqOLnfjzGwjSxEm3O0q52Q2u2rVJphxHeDwcvdgS10gmxm0wfJam29uNoDKTY7uGn1C4Tfp6bJfMcntvDupsdngkcPkuNwOzKmK+I5vdawjO889A0C7nSbAcVt9p9sBzHQ6Zt5g+id2GqhzCDnyisHODTuaAW2mScwGmgF4WpsmsdZ11jkdrbJfQe0OmHSQSINjDgRJgj5qu78R6n3W92u2kMRiDl/Awvy8y9+ZxnfeB4FYlQd49T7rrzueXLrN8GgJikBUarJCgpSEIEKAEqEDYQU4tSEIGpQNEQlaLoEKQpUiBWi4CQlS4dl+gJ8goigEiIQguunSNUxrY10+adCf8ADN/v0QQo5pxbrCQBAkIcE4UjHsnOEDnfwQI0Q09R7FRVHb1K02d4e6hxGhQNdVg34A+YB+aVtVvFQ19f9Lf+oTAguNcEt1UlJKC0Va2fhHVXhjdTbdAnjJCzA5XaTi1nX2Uqx0I2VjMDNUSwbzmbcDSQDPos7bG2n1oLjc3PJ2hI6qi7EuiDMcJMQqpBmCpIt6/DqlQn5KehtOrSpuYx5aHGXRFxEG+oHQqnfqtLZeBc97pbZrS53IRAnqSAqkZYqnirT3XJ5qtUpFphTU3CAqgKQBOL+QSZ/uyBCkCd8RN+JzQKOiDKbmRKB0IypspEDoQNUxCCSySyYhBPSqAB1tRHhIUZITAlgIAlCTKhBonEDcY6BRuqt5+n1VaSlh3A+SCwKoi0+iQV/uR9FEKDtzSg0HDUeyCUYnkPVRmryHqkOHclGHMwgVtfWw8kyu+RHyCeMPzTK9KBqggri/g3/qE2m0kgDepMWO94N/6hWNjsmpfggKeDv4q5S2WDaD4LUZRGbTefdXPgkabtVcTWRQwLW6AfPzUe0qBiQtf4R18+fom1KI3phrmsNRdUdla0k8l0dXsViG0v3lzP7MEZxvDT+b/Lx4arp+wFPD03YirVFmNpZQBmc4udUkNbqT3RyG8hddszHVsW/L/gURcMB7zxP/kcP+otuJcFcTXA7J2FRbTfULSC3Rrueh9FY2TgA3BVX2NSvVBIkSykwTTDuGaS4cnBdF2l2cGYhtJoDW4hoLWus0Gm7vNOWYa4uZ0zHgFHsjssGveRXFQupZ3uH4X5i+D4FtjuvuJBxxzduunfUyY8px+EP42+MTII3qlGbWJ46Lo8PYkHilqbOa4zoN4ACrLnBhXbv6JjqRG5dRiKENaxotOYxwHHnJCq4jCQJQc+WpAFq42h/ZNiLSfUg38lk5ggcSEJudJmCB0pE3OkzoHITMyMyB6RMzIzIJGoUeYpQ5BIAkTS9CDWp1CBvunVjY2UZYeu9Nc6yCehWgRCgqShr0VHg/fJA8TvjTmoybi8SnSB7FNf8kCTunfuUWKqdyOY9nfVK4clKKXxGuk3DXO8WiY9EGbUJm/L2ELoNj4UtAMX187rCoU8z2jiV2OFEa2VhTms/tI6kdCJPurNVxFk5v42GOR8jHufNS4rDk+CrKqVG8qb4I3prmoO2/ZhhQW4l3NjfDKSR/uXS1dmNb32nKYsbwOp8Asj9lrZoYj/ANkf8bPquixuNDQAGgkmL9OG9EYezcR8faNQuucLTDBbR9XvEg/5beSbSrh2JxZpAfDp0HU3EaGqM7jHEjMATxBWNhsRVY+sylbE43EPgxHwqNM/C+JHE5HFvnuv2GJ2ezC4KsxggMw9S+8uyuJJ4klI1XimjyOiuQYEKrXb3lYwz9ygexsnoI8/6BNqsBBCma3Xmf5fJZO1McGgtbqTlnhOqYHVqEsAgEX9yuZxtHK4iIH3oumfhaj26kNAADWkCwsMzzEnp6rCxuE1ILemaSenFRWehBCEAkKVIgEBBQEAkSpIQCEqCgRCEINotM3UZCldp1Fv5qEc0Dy2yhLVOHRZMy6TogYeiR5T36yo3NQI5WMGYznk3yL2g+H1VdqmwujzfQDze36IE2dhruPAwF0WFpnzVTZ9D1WqWloiNysSqOMxZYWxyWoMRIXM7Xq3HVaVCtLQqNNlObplRgCbgqtiEhqybIj0X9mAIwtc8axHlTprUqQzNVf+Fsu3QIGqo/s3aRgidzq1Qjwyt/8AlaW3MKajWUf1uBJ/hb3jPiAqlUuyGDNRz8ZUHeqQGD9NMWaB7nmSd61O1zowVfmwjzgK5s8AMyiwaYHSAVm9tnRgq3+gedRg+aivG67LlM0CsVgQZUrXCRyv5fzhTFPgtaTyXGOM1RYG5N9N+viuo2jihlMLjH1ofPNKR2VIhzA0klusceM8Pon4ijTc24AG4AaelysTA4rP3W6feq6GmQGwT9/NUczj9mMN2Pg8Hb+hWLUYWmCIK7iq6idXEHk53sFmY/AUH6OeDuJY4+sKYOXKCpsThyw6hw4ifUG4UKikCUpEIFlEpEIBCEIBCEqDZduUfBPP37qBzKhBcAA0GJJ1+pQSE6BPpibaqmBUnUKQh29x8IHsEFx2FedGuPhYKs9lpkDxEz0TSHaZ3RwzO+qj+G0bh7+6B4rgaRPEqbAvzZgDMgE8LFVvLwAHsFc2fUynKAXON43AbrweaDodkYMjvOPQKTHPk8lSG1skBzR5ub5S2D5hUdoY8vPc7sagi8/TotIr7ZpxHUJ9F74sVSxOKe4ZXEWIMBPpVHRZRWvQDjy3eC0GNDWqhsxpmXGVcxrxkMfeiqPRv2fYr+5saNA589XOLj7rqaDsxJOosPFYPYDZ3w8FSLvxOl7uWbQDwXQYioKYndYn78lWD6AIJ4GLdBCxu3j/AO5vHE0x/wAjFt0md53Igf7Qfmsftwz+5VeRpH/lYory2m/UELO+JLnAaA5fLX1MeClx2J+G1zo005nQeZhV8K/KwNAk6k8XG5PmjRu0RDFylUw5dLtGS2T9zZczW1UqpadU8Y6LodkbUnuvudx5LmGOjotCg1hFnweBUHXOrH8seOirvzHWp4NAHqqVHEWAndfn4qUEK1FXHYcHQ5hvsSsLGYbIbae3VdbSB1z5ecA+UqnjMQw2dWe/llbHsorlpQVZxNATLdOCrFAkISlCBEIQgEIQg3S5gzRJ/STbrI/moC9xtJIG5Od0TALICUkaoiEjjCBCdEkybIKVtBxuGuPQFBGQtLB1GtAAAzGMx4AAWAVZuz6p/IfG3un0aLmPDXC9ra6zCDYLe4QRIP5YbHUhYTq4puIy5maQd3jyPkuiylo331Nrngub2kO+5UR4Y9+14v4cPVaxotIlo5+Cy9mWl2u48grbXumW7tyRGzgmZW6aqDEEFwHE36BNp4sOEZSOSkw+EdUrMa2ALBUex7DrZaTGgggNaLaaLcgwIuSNfFc3sXCFjQ1dRSENA5K1ght5+1vksDtq4/ulbo0/72H5Lfyn1PusPtrlbgcQ4/lpk+RBQeL7Xd8WsykNG95/yHl7hWqlanT1P1WThaNSC82c8yT13I+EAZN1ltFtLHF/IDcsqpSmVoZRJJufZVmOku6/JSrFIsQJCvZRvEjhp4g7ioqlGBmbdu/i08HD56IJMNjosVp4fFA71hEApGvIV0dRWaCL6rS7MdkH4x5IdlptMPfG/XK3i6PKb7geSw+0NASvWew/aihToU6L/wCzcJJnRxc4kunxSeUtxJi+zuzMNlpVA1pIkvcx1Z4aTGYwCRJmIAFjouS7X9isMwCpgsVTrZw5wpA94hkZw2J7wkSDHRdBi8b8WpUeblz3+DWuLGjyaPJc/tCmWOzNkHS3sfZcvk846/H415+QkU2Loljy2/KeG5RLo5kQhCAQhCDq2bEdveB4EqZmxG73nwAC1wEZVBnDZNLeCep+ie3AUhpTb4391eypMqCBtMDRoHgEOU+VI5qghyrPxwayq2o7QNPiQbAc+8tVoWV2gdlDHRJkgcpj6KwPoPBGd7jnP8JLWjc0fXesvbU2Lhb9UR4KzgqxgON3buDeg481aq1XOHeuDqCqOewRAcbxvlaVLDTcW6KmKDWVDOh05FaeHo5d9lYhaz/hxaZBPO0C48fQrf8A2f0G1a4DjzHMjUdVT2X2Ur43NUYcjWSGl2jne673srsgtp5KrGmo03LYFRvAg/nHX1WoldgzCACwTnunKQbjdu0MzwSCo4NuZ4O08XDcuf2ptGrVf+7YbVv+LUuGggXbPW54xHFEXtrdoaWGbNV4Lv0tuTPJcZtPGYvaALQPg0DbvfmG6RqegWvhdm4OiZfVpuqDVxcHunk0TCqY/bVF9QUqNR2gn4TS+u8/pZIik2Il5ve0RKqPOMV8Wm80yDmaYdmG/fAj1UYwtR2sLpe0eArNLqrsKaFJrWiS9ryZOryHEl0m5Oq47H7YOjPNYrcSY9lOk03kncsXDnvJj3kmSZKWmYIKiryASDIMH3HAjeEhSLLSKq0EyBB4bv8AT9FDKtESm/BDjBMHc7d0d9VUxULVq9n9nPxFZtLNkBuXQJgRpzuFVq4J7JDmlpGoOsbj0Pqui7BVQa+U3LWHLAk6gEc1OrkXmbY7ihsVglmY92BM20tJ49VBiez5cHQ6IFrb1zPajbtbC4lzaThDmgmZMEyDHAwAoOzPbKo1/wAOuZY8/i0yk2vyXH2XNdvfNxLj9itfRFQ2E5XW/CZy5uk6rmdo7HqUpJBLWmCY/Cf4huHPQr0yszJ3X3oVDr+lxsfA2ndv61oex4pugVIim5wllVn6HTv5q89WJ1zK8qSr0DaGw8JXcWEfuuIicsdxx3xxHRcbtbZFXDOy1GxP4XbnDiCus6lcrzYoIQhaZenNajKhCyFLU0tQhAmVBahCBhaqm18PmpO5DMOrb+0jxQhUZmwMFUxFVlKmAXvNpMACJJJ4ASbX4L2PYXYbC0Wj4jRWqb3PAyz/AAs0A6yeaELcRS7abGwXwslVrKZP4HNp3aeWVtl5WzB1alYYVsF4IDjYCIkETxEHxjihCg9m7LbMOGoMZmzC+adzzw5LaqYRpuRcaEWI8UIWmDKhcwWIJ5j6ELkdt7co4KoyrWbmbUlpDWtJBEHPERAA3EHk60CFribZBu7N2rRxVIVaTszHTBhzdLEQQClp0mtcXak79/RCFP6tUu0WCGIoVKJdAe0tmNDuPnC8MrbIdRqOp1AMzTBgyLbxyQhZ6OTcRhQYmFQxGEjRKhZbSs0HREoQo0JSoQoL1HaghlKuC9mVpa4f4lIuEnITq3iw26G6bhtoVMHWFWllJLSGugw5rvzRYg2/qhC1mxlQxOMdUe57znc67iZ9FWfT37kIUarrOyHaLu/ulck03mGOPeLSd3RdfWwL/hDC1jM5jRqTLu4dOIIsZ+aELl3PLp6d2MvF4E4iMPiu7VDczKg72ZnGxs4GJlcvtLbdZlJ+EfUbUaDEuZLoGmVx+YlCFrn7O/rXOIQhdHF//9k="
          alt={`${user.firstName}'s profile`}
          className="profile-img"
        />
        <h1 className="profile-name">{`${user.firstName} ${user.lastName}`}</h1>
        <p className="email-id">{user.email}</p>
        <p className="education">
          <b>Education:</b> {user.dept}, {user.batch}
        </p>
        <div className="bio">
          <b>Bio:</b> {user.bio || "No bio available"}
        </div>

        <div className="skills-section">
          <h3>Skills</h3>
          <div className="skills">
            {user.skills != undefined
              ? user.skills.map((skill, index) => (
                  <div className="skill" key={index}>
                    {skill}
                  </div>
                ))
              : ""}
          </div>
        </div>

        <div className="social-links">
          <h3>Social Links</h3>
          <div className="links">
            {user.linkedIn && (
              <a
                href={user.linkedIn || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            )}
            {user.github && (
              <a
                href={user.github || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            )}
            {user.twitter && (
              <a
                href={user.twitter || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
            )}
          </div>
        </div>

        <div className="interests-section">
          <h3>Interests</h3>
          <div className="interests">
            {user.interests != undefined
              ? user.interests.map((interest, index) => (
                  <div className="interest" key={index}>
                    {interest}
                  </div>
                ))
              : ""}
          </div>
        </div>

        {user.companyName && (
          <div className="company">
            <b>Company:</b> {user.companyName}
          </div>
        )}

        {/* Edit Button at the Bottom */}
        <button className="edit-btn" onClick={openEditDialog}>
          Edit Profile
        </button>
      </div>

      {/* Edit Dialog */}
      {isEditDialogOpen && (
        <div
          className="dialog-overlay"
          onClick={() => setIsEditDialogOpen(false)}
        >
          <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Profile</h2>
            <form onSubmit={handleEdit}>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData?.firstName || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData?.lastName || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData?.email || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="dept"
                  value={formData?.dept || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={formData?.bio || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>LinkedIn</label>
                <input
                  type="text"
                  name="linkedIn"
                  value={formData?.linkedIn || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>GitHub</label>
                <input
                  type="text"
                  name="github"
                  value={formData?.github || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Twitter</label>
                <input
                  type="text"
                  name="twitter"
                  value={formData?.twitter || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Interests</label>
                <input
                  type="text"
                  name="interests"
                  value={formData?.interests?.join(", ") || ""}
                  onChange={handleInputChange}
                  placeholder="Comma separated values"
                />
              </div>
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData?.companyName || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Batch</label>
                <input
                  type="number"
                  name="batch"
                  value={formData?.batch || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
