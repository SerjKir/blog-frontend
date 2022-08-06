import Container from "@mui/material/Container";

import { Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import { fetchMe, selectIsAuth } from "./redux/slices/auth";
import { authRoutes, publicRoutes } from "./routes";

function App() {
  const dispatch = useDispatch();
  const getUserData = useCallback(async () => {
    await dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    getUserData().then();
  }, [getUserData]);

  const isAuth = useSelector(selectIsAuth);
  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          {(isAuth ? authRoutes : publicRoutes).map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.component}
              exact={route.exact}
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
