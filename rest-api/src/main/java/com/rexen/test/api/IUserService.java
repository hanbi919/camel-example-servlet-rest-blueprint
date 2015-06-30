package com.rexen.test.api;

import com.rexen.test.model.User;

import java.util.Collection;

/**
 * Created by sunlf on 2015/6/25.
 */
public interface IUserService {
    User getUser(String id);

    Collection<User> listUsers();

    void updateUser(User user);

    String getUserName();
}
