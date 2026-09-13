import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/food-posts";
const emptyForm = {
  donor_id: "",
  food_type: "Veg",
  quantity: "",
  expiry_time: "",
  latitude: "",
  longitude: "",
};

const navigation = ["Home", "My Donations", "Post New Food", "Food Journey", "Ratings", "History", "Notifications", "Profile"];
const foodTypes = [
  { name: "Veg", className: "veg" },
  { name: "Non-veg", className: "nonVeg" },
  { name: "Cooked", className: "cooked" },
];

function App() {
  const [form, setForm] = useState(emptyForm);
  const [foodPosts, setFoodPosts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("Loading food posts...");
  const [saving, setSaving] = useState(false);

  const loadFoodPosts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not load food posts.");
      setFoodPosts(data.foodPosts || []);
      setStatus("");
    } catch (error) {
      setStatus(error.message || "Cannot connect to the backend. Start it on port 5000.");
    }
  };

  useEffect(() => { loadFoodPosts(); }, []);

  const changeField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const saveFoodPost = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    const payload = {
      ...form,
      quantity: Number(form.quantity),
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
    };
    const isEditing = Boolean(editingId);

    try {
      const response = await fetch(isEditing ? `${API_URL}/${editingId}` : API_URL, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not save food post.");
      setStatus(data.message);
      setForm(emptyForm);
      setEditingId(null);
      await loadFoodPosts();
    } catch (error) {
      setStatus(error.message || "Could not save food post.");
    } finally {
      setSaving(false);
    }
  };

  const editFoodPost = (foodPost) => {
    setEditingId(foodPost.id);
    setForm({
      donor_id: foodPost.donor_id || "",
      food_type: foodPost.food_type || "Veg",
      quantity: foodPost.quantity || "",
      expiry_time: foodPost.expiry_time ? new Date(foodPost.expiry_time).toISOString().slice(0, 16) : "",
      latitude: foodPost.latitude ?? "",
      longitude: foodPost.longitude ?? "",
    });
    setStatus(`Editing food post #${foodPost.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteFoodPost = async (id) => {
    if (!window.confirm("Delete this food post?")) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not delete food post.");
      setStatus(data.message);
      await loadFoodPosts();
    } catch (error) {
      setStatus(error.message || "Could not delete food post.");
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand"><span className="brand-mark">SM</span><span>ShareMeal</span></div>
          <nav className="side-nav" aria-label="Main navigation">
            {navigation.map((label) => <button className={`nav-link ${label === "Post New Food" ? "active" : ""}`} key={label} type="button"><span className="nav-icon">o</span><span>{label}</span>{label === "Post New Food" && <span className="nav-arrow">&gt;</span>}</button>)}
          </nav>
        </div>
        <div className="account-section"><div className="account"><span className="avatar small">PS</span><div><strong>Priya Sharma</strong><span>Donor</span></div></div><button className="logout" type="button">Logout</button></div>
      </aside>

      <section className="content-area">
        <header className="topbar"><h1>Post New Food</h1><div className="top-actions"><button className="notification" type="button" aria-label="Notifications">N<span>2</span></button><span className="avatar">PS</span></div></header>
        <main className="page-content">
          <section className="post-card">
            <div className="steps"><div className="step current"><span>1</span><p>Food Info</p><b>&gt;</b></div><div className="step"><span>2</span><p>Pickup Details</p><b>&gt;</b></div><div className="step"><span>3</span><p>Photo &amp; Notes</p></div></div>
            <form className="form-content" onSubmit={saveFoodPost}>
              <h2>{editingId ? "Update your food post" : "What are you sharing?"}</h2>
              <label className="field-label">Food Type</label>
              <div className="food-types">{foodTypes.map((food) => <button className={`food-type ${food.className} ${form.food_type === food.name ? "selected" : ""}`} key={food.name} onClick={() => setForm((current) => ({ ...current, food_type: food.name }))} type="button"><span className="food-icon">F</span><span>{food.name}</span></button>)}</div>
              <div className="form-grid">
                <label><span>Donor ID</span><input name="donor_id" onChange={changeField} placeholder="e.g. 1" required value={form.donor_id} /></label>
                <label><span>Quantity</span><input min="1" name="quantity" onChange={changeField} placeholder="e.g. 12 meals" required type="number" value={form.quantity} /></label>
                <label><span>Expiry time</span><input name="expiry_time" onChange={changeField} required type="datetime-local" value={form.expiry_time} /></label>
                <label><span>Latitude</span><input name="latitude" onChange={changeField} placeholder="e.g. 23.8103" required step="any" type="number" value={form.latitude} /></label>
                <label><span>Longitude</span><input name="longitude" onChange={changeField} placeholder="e.g. 90.4125" required step="any" type="number" value={form.longitude} /></label>
              </div>
              <div className="form-actions"><button className="continue-button" disabled={saving} type="submit">{saving ? "Saving..." : editingId ? "Update food" : "Post food"}</button>{editingId && <button className="cancel-button" onClick={() => { setEditingId(null); setForm(emptyForm); }} type="button">Cancel</button>}</div>
            </form>
          </section>

          <section className="posts-section"><div className="posts-heading"><h2>Your food posts</h2><button className="refresh-button" onClick={loadFoodPosts} type="button">Refresh</button></div>{status && <p className="status-message">{status}</p>}{foodPosts.length === 0 && !status ? <p className="empty-state">No food posts yet. Add your first donation above.</p> : <div className="post-list">{foodPosts.map((post) => <article className="saved-post" key={post.id}><div><strong>{post.food_type}</strong><span>{post.quantity} meals - expires {new Date(post.expiry_time).toLocaleString()}</span><small>Location: {post.latitude}, {post.longitude}</small></div><div className="post-buttons"><button onClick={() => editFoodPost(post)} type="button">Edit</button><button className="delete-button" onClick={() => deleteFoodPost(post.id)} type="button">Delete</button></div></article>)}</div>}</section>
        </main>
      </section>
    </div>
  );
}

export default App;
