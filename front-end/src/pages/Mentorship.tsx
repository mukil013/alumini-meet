import axios from "axios";
import React, { useEffect, useState } from "react";
import "./style/Mentor.css";

export default function Mentorship() {
  const [community, setCommunity] = useState([]);
  const [following, setFollowing] = useState([]);
  const { role, userId } = JSON.parse(sessionStorage.getItem("user")!);
  const [currentPage, setCurrentPage] = useState("explore");
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Post State
  const [showPostForm, setShowPostForm] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [postImage, setPostImage] = useState<File | null>(null);
  const [editingPost, setEditingPost] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [groupTitle, setGroupTitle] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  async function fetchGroups() {
    try {
      let url = "";
      if (currentPage === "explore")
        url = "http://localhost:8000/mentorship/getAll";
      else if (currentPage === "yours")
        url = `http://localhost:8000/mentorship/get/${userId}`;
      else if (currentPage === "following")
        url = `http://localhost:8000/mentorship/followed/${userId}`;

      const response = await axios.get(url);
      if (currentPage === "following") setFollowing(response.data);
      else setCommunity(response.data.mentorshipGroups);
    } catch (e) {
      console.error("Error fetching mentorship groups:", e);
    }
  }

  useEffect(() => {
    fetchGroups();
  }, [currentPage]);

  const toggleFollow = async (groupId: string) => {
    try {
      await axios.post(
        `http://localhost:8000/mentorship/follow/${groupId}/${userId}`
      );
      fetchGroups();
    } catch (error) {
      console.error("Error following/unfollowing group:", error);
    }
  };

  const handleAddCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("groupTitle", groupTitle);
    formData.append("groupDescription", groupDescription);
    if (image) formData.append("image", image);

    try {
      await axios.post("http://localhost:8000/mentorship/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowAddForm(false);
      fetchGroups();
    } catch (error) {
      console.error("Error adding mentorship group:", error);
    }
  };

  return (
    <div className="mentor-body">
      <div className="tabs">
        <button
          className={`tab ${currentPage === "explore" ? "active" : ""}`}
          onClick={() => setCurrentPage("explore")}
        >
          Explore
        </button>
        <button
          className={`tab ${currentPage === "following" ? "active" : ""}`}
          onClick={() => setCurrentPage("following")}
        >
          Following
        </button>
        {role === "alumini" && (
          <button
            className={`tab ${currentPage === "yours" ? "active" : ""}`}
            onClick={() => setCurrentPage("yours")}
          >
            Yours
          </button>
        )}
      </div>

      {/* Explore Section */}
      {currentPage === "explore" && (
        <div className="mentor-content-page">
          {community.length > 0 ? (
            community.map((group) => (
              <div
                key={group._id}
                className="mentorship-card"
                onClick={() => setSelectedGroup(group)}
                title={group.groupTitle}
              >
                <div>
                  <h2>{group.groupTitle}</h2>
                  <p>{group.groupDescription}</p>
                </div>
                <button
                  className="follow-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFollow(group._id);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#fff"
                    className={
                      group.followers.includes(userId)
                        ? "svgFollow"
                        : "svgUnfollow"
                    }
                  >
                    <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <p>No mentorship groups found.</p>
          )}
        </div>
      )}

      {/* Following Section */}
      {currentPage === "following" && (
        <div className="mentor-content-page">
          {following.length > 0 ? (
            following.map((group) => (
              <div
                key={group._id}
                className="mentorship-card"
                onClick={() => setSelectedGroup(group)}
                title={group.groupTitle}
              >
                <div>
                  <h2>{group.groupTitle}</h2>
                  <p>{group.groupDescription}</p>
                </div>
                <button
                  className="follow-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFollow(group._id);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#fff"
                    className={
                      group.followers.includes(userId)
                        ? "svgFollow"
                        : "svgUnfollow"
                    }
                  >
                    <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <p>You are not following any mentorship groups.</p>
          )}
        </div>
      )}

      {/* Yours Section */}
      {currentPage === "yours" && (
        <div className="mentor-content-page">
          {role === "alumini" && (
            <button
              onClick={() => setShowAddForm(true)}
              className="add-community"
            >
              Add Community
            </button>
          )}
          {showAddForm && (
            <dialog open={showAddForm} className="dialog-box">
              <form
                onSubmit={handleAddCommunity}
                className="add-community-form"
              >
                <h3>Create a Mentorship Group</h3>
                <input
                  type="text"
                  placeholder="Group Title"
                  value={groupTitle}
                  onChange={(e) => setGroupTitle(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Group Description"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  required
                ></textarea>
                <button type="submit">Add Group</button>
                <button type="button" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
              </form>
            </dialog>
          )}
          {community.length > 0 ? (
            community.map((group) => (
              <div
                key={group._id}
                className="mentorship-card"
                onClick={() => setSelectedGroup(group)}
              >
                <div>
                  <h2>{group.groupTitle}</h2>
                  <p>{group.groupDescription}</p>
                </div>
              </div>
            ))
          ) : (
            <p>You have no mentorship groups yet.</p>
          )}
        </div>
      )}

      {/* Expanded Group View */}
      {selectedGroup && (
        <div className="dialog-overlay">
        <dialog className="dialog-box" open={selectedGroup} onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setSelectedGroup(null)}>Back</button>
          <div>
            <h2>{selectedGroup.groupTitle}</h2>
            <p>{selectedGroup.groupDescription}</p>
          </div>

          <h3>Posts</h3>
          {role === "alumini" && selectedGroup.userId === userId && (
            <button onClick={() => setShowPostForm(true)}>+ Add Post</button>
          )}

          {selectedGroup.posts.length > 0 ? (
            selectedGroup.posts.map((post) => (
              <div key={post._id} className="post-card">
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                {post.image && (
                  <img
                    src={`data:${post.image.contentType};base64,${Buffer.from(
                      post.image.data.data
                    ).toString("base64")}`}
                    alt="Post Image"
                    style={{ width: "100px", height: "100px" }}
                  />
                )}
                {role === "alumini" && selectedGroup.userId === userId && (
                  <>
                    <button
                      onClick={() => {
                        setEditingPost(post);
                        setPostTitle(post.title);
                        setPostDescription(post.description);
                        setShowPostForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDeletePost(post._id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            ))
          ) : (
            <p>No posts yet.</p>
          )}
        </dialog>
        </div>
      )}

      {/* Add/Edit Post Modal */}
      {showPostForm && (
        <dialog open={showPostForm}>
          <form
            onSubmit={editingPost ? handleEditPost : handleAddPost}
            className="post-form"
          >
            <h3>{editingPost ? "Edit Post" : "Add Post"}</h3>
            <input
              type="text"
              placeholder="Post Title"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Post Description"
              value={postDescription}
              onChange={(e) => setPostDescription(e.target.value)}
              required
            ></textarea>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button type="submit">
              {editingPost ? "Update Post" : "Add Post"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowPostForm(false);
                setEditingPost(null);
              }}
            >
              Cancel
            </button>
          </form>
        </dialog>
      )}
    </div>
  );
}
