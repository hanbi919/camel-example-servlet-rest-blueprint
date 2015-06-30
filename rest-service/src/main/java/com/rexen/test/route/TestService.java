package com.rexen.test.route;

import com.rexen.test.api.IUserService;

/**
 * Created by sunlf on 2015/6/25.
 */
public class TestService {
    IUserService userService;

    public void setUserService(IUserService userService) {
        this.userService = userService;
    }

    public void init() {
        System.out.print(
                userService.getUserName());
    }
}
