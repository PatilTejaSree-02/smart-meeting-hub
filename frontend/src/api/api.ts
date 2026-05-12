import axios from "axios";

/* ================= AXIOS INSTANCE ================= */

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL + "/api",
});

/* ================= JWT INTERCEPTOR ================= */

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

/* ================= SMART TENANT EXTRACTION ================= */

const getTenantFromEmail = (
  email: string
) => {

  const [username, domain] =
    email.split("@");

  /* ================= GMAIL / OUTLOOK / YAHOO ================= */

  const personalDomains = [
    "gmail.com",
    "outlook.com",
    "yahoo.com",
    "hotmail.com",
  ];

  if (
    personalDomains.includes(domain)
  ) {

    /*
      Example:
      rajashekar.saphana@gmail.com

      Extract:
      saphana
    */

    const usernameParts =
      username.split(".");

    if (
      usernameParts.length >= 2
    ) {

      return usernameParts[
        usernameParts.length - 1
      ];
    }

    return null;
  }

  /* ================= CORPORATE DOMAIN ================= */

  /*
    Example:
    john@acme.com

    Extract:
    acme
  */

  return domain.split(".")[0];
};

/* ================= LOGIN FUNCTION ================= */

export const login = async (
  email: string,
  password: string
) => {

  const tenant =
    getTenantFromEmail(email);

  if (!tenant) {

    throw new Error(
      "Unable to determine company from email"
    );
  }

  /* SAVE TENANT */

  localStorage.setItem(
    "tenant",
    tenant
  );

  /* LOGIN REQUEST */

  const res = await api.post(
    "/auth/login",
    {
      email,
      password,
      tenant,
    }
  );

  /* SAVE TOKEN */

  if (res.data?.token) {

    localStorage.setItem(
      "token",
      res.data.token
    );
  }

  return res.data;
};

/* ================= LOGOUT ================= */

export const logout = () => {

  localStorage.removeItem("token");

  localStorage.removeItem("tenant");

  localStorage.removeItem("user");

  window.location.href = "/";
};

export default api;