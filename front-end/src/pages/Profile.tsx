import React from "react";
import "./style/Profile.css";

export default function Profile() {
  const imgSrc: string = "https://placehold.co/200x200";
  const skills = ["java", "puthon", "c#", "node", "javascript"];
  return (
    <div className="profile-container">
      <div className="profile-card">
        <img src={imgSrc} alt="" className="profile-img" />
        <h1 className="Profile-name">Profile Name</h1>
        <p className="email-id">sample@gmail.com</p>
        <p id="education">
          <b>Education</b>
          B.E
        </p>
        <p className="bio">
          <b>bio : </b>Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          Omnis quod libero distinctio voluptatem molestiae! Pariatur quam fugiat
          ex distinctio error amet doloremque, modi repudiandae, dolores, ipsa
          tenetur earum quidem sint. Corporis odit et ipsa obcaecati facilis
          aliquam ad accusamus sunt sint repellendus sapiente odio sequi minima,
          quo molestias temporibus, officiis suscipit fugiat alias reprehenderit
          quae omnis! Inventore eveniet corporis vitae.
        </p>
        <div id="skills">
          {skills.map((i) => (
            <div className="skill" key={i}>
              {i}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
