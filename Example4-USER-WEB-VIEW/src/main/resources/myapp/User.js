/**
 * 用户组件
 *
 * @author majian <br/>
 *         date:2015-6-18
 * @version 1.0.0
 */
Ext.define('AppFrame.view.main.components.User', {
    extend: 'Ext.panel.Panel',

    items: [],
    constructor: function () {
        this.id = "tab_user";
        var pageSize = 20;
        var dataStore = Ext.create("Ext.data.JsonStore", {
            pageSize: pageSize,
            fields: [
                'id', 'username', 'password', 'name', 'sex', 'status'
            ],
            proxy: {
                type: "ajax",
                url: "/userListServlet",
                reader: {
                    type: "json",
                    root: "datas",
                    totalProperty: 'total'
                }
            }
        });
        dataStore.loadPage(1);


        var dataGrid = Ext.create('Ext.grid.Panel', {
            id: "userDataGrid",
            store: dataStore,
            stripeRows: true,
            manageHeight: true,
            selModel: {selType: 'checkboxmodel', mode: "SIMPLE"},
            columns: [
                {text: '编号', dataIndex: 'id'},
                {text: '用户名', dataIndex: 'username'},
                {text: '密码', dataIndex: 'password'},
                {text: '姓名', dataIndex: 'name'},
                {
                    text: '性别', dataIndex: 'sex', renderer: function (value) {
                    if (value) {
                        if ("1" == value) {
                            return "男";
                        }
                        return "女";
                    }
                    return "男";
                }
                },
                {
                    text: '状态', dataIndex: 'status', renderer: function (value) {
                    if (value) {
                        if ("1" == value) {
                            return "启用";
                        }
                        return "禁用";
                    }
                    return "禁用";
                }
                },
                {
                    header: '操作',
                    xtype: "actioncolumn",
                    items: [{
                        icon: "resources/images/pencil.png",
                        handler: function (grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            var editFormPanel = new Ext.FormPanel({
                                labelAlign: 'center',
                                labelWidth: 75,
                                autoWidth: true,
                                autoHeight: true,
                                url: '/userUpdateServlet',
                                bodyStyle: "padding:15px",
                                frame: true,
                                buttonAlign: "center",
                                items: [
                                    {xtype: 'hiddenfield', name: 'id', value: rec.data.id},
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: '密码',
                                        id: 'passwordId',
                                        name: 'password',
                                        allowBlank: false,
                                        blankText: '不能为空!',
                                        value: rec.data.password
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: '姓名',
                                        id: 'nameId',
                                        name: 'name',
                                        allowBlank: false,
                                        blankText: '不能为空!',
                                        value: rec.data.name
                                    },
                                    {
                                        xtype: 'combobox',
                                        fieldLabel: '性别',
                                        name: 'sex',
                                        id: 'sexId',
                                        store: [
                                            ['1', '男'],
                                            ['0', '女']
                                        ]
                                    },
                                    {
                                        xtype: 'combobox',
                                        fieldLabel: '状态',
                                        id: 'statusId',
                                        name: 'status',
                                        store: [
                                            ['1', '启用'],
                                            ['0', '禁用']
                                        ]
                                    }
                                ],
                                buttons: [
                                    {
                                        text: '保存', type: 'submit', handler: function () {
                                        var form = this.up('form').getForm();
                                        if (form.isValid()) {
                                            form.submit({
                                                success: function (form, action) {
                                                    Ext.Msg.alert('Success', action.result.msg);
                                                    dataStore.loadPage(1);
                                                },
                                                failure: function (form, action) {
                                                    Ext.Msg.alert('Failed', action.result.msg);
                                                }
                                            });
                                        }
                                    }
                                    },
                                    {
                                        text: '重置', handler: function () {
                                        this.up('form').getForm().reset();
                                    }
                                    }
                                ]
                            });

                            Ext.getCmp("sexId").setValue(rec.data.sex);
                            Ext.getCmp("statusId").setValue(rec.data.status);

                            var win = new Ext.Window({
                                width: 510,
                                height: 260,
                                border: false,
                                modal: true,
                                title: "编辑用户",
                                items: [editFormPanel]
                            });

                            win.show();
                        }
                    }, {
                        icon: "resources/images/cancel.png",
                        handler: function (grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            Ext.Msg.confirm("警告", "确定要删除吗？", function (button) {
                                if (button == "yes") {
                                    Ext.Ajax.request({ //初始化选项卡
                                        url: "/userDeleteServlet?id=" + rec.id,
                                        method: "GET",
                                        callback: function (options, success, response) {
                                            var resp = Ext.JSON.decode(response.responseText);
                                            Ext.MessageBox.alert("提示信息", resp.msg);
                                            if (resp.success) {
                                                var username = Ext.getCmp("username").getValue();
                                                var name = Ext.getCmp("name").getValue();
                                                var sex = Ext.getCmp("sex").getValue();
                                                var status = Ext.getCmp("status").getValue();
                                                var grid = Ext.getCmp("userDataGrid");
                                                var store = grid.getStore();
                                                store.reload({
                                                    params: {
                                                        start: 0,
                                                        limit: pageSize,
                                                        username: username,
                                                        name: name,
                                                        sex: sex,
                                                        status: status
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                        }

                    }]
                }
            ],
            tbar: [
                {
                    text: '新增', icon: 'resources/images/group_add.png', handler: function () {

                    var addFormPanel = new Ext.FormPanel({
                        labelAlign: 'center',
                        labelWidth: 75,
                        autoWidth: true,
                        autoHeight: true,
                        url: '/userAddServlet',
                        bodyStyle: "padding:15px",
                        frame: true,
                        buttonAlign: "center",
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: '用户名',
                                id: 'usernameId',
                                name: 'username',
                                allowBlank: false,
                                blankText: '不能为空!'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '密码',
                                id: 'passwordId',
                                name: 'password',
                                allowBlank: false,
                                blankText: '不能为空!'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '姓名',
                                id: 'nameId',
                                name: 'name',
                                allowBlank: false,
                                blankText: '不能为空!'
                            },
                            {
                                xtype: 'combobox',
                                fieldLabel: '性别',
                                name: 'sex',
                                store: [
                                    ['1', '男'],
                                    ['0', '女']
                                ]
                            },
                            {
                                xtype: 'combobox',
                                fieldLabel: '状态',
                                name: 'status',
                                store: [
                                    ['1', '启用'],
                                    ['0', '禁用']
                                ]
                            }
                        ],
                        buttons: [
                            {
                                text: '保存', type: 'submit', handler: function () {
                                var form = this.up('form').getForm();
                                if (form.isValid()) {
                                    form.submit({
                                        success: function (form, action) {
                                            Ext.Msg.alert('Success', action.result.msg);
                                            var username = Ext.getCmp("username").getValue();
                                            var name = Ext.getCmp("name").getValue();
                                            var sex = Ext.getCmp("sex").getValue();
                                            var status = Ext.getCmp("status").getValue();
                                            var grid = Ext.getCmp("userDataGrid");
                                            var store = grid.getStore();
                                            store.reload({
                                                params: {
                                                    start: 0,
                                                    limit: pageSize,
                                                    username: username,
                                                    name: name,
                                                    sex: sex,
                                                    status: status
                                                }
                                            });
                                        },
                                        failure: function (form, action) {
                                            Ext.Msg.alert('Failed', action.result.msg);
                                        }
                                    });
                                }
                            }
                            },
                            {
                                text: '重置', handler: function () {
                                this.up('form').getForm().reset();
                            }
                            }
                        ]
                    });


                    var win = new Ext.Window({
                        width: 510,
                        height: 260,
                        border: false,
                        modal: true,
                        title: "新增用户",
                        items: [addFormPanel]
                    });

                    win.show();
                }
                }, "-",
                {
                    text: '批量删除', icon: 'resources/images/group_delete.png', handler: function () {
                    var selModel = Ext.getCmp("userDataGrid").getSelectionModel();
                    if (selModel.hasSelection()) {
                        Ext.Msg.confirm("警告", "确定要删除吗？", function (button) {
                            if (button == "yes") {
                                var rows = selModel.getSelection();
                                var ids = "";
                                for (var i = 0; i < rows.length; i++) {
                                    if (rows[i] != null && rows[i].id != null) {
                                        ids += rows[i].id;
                                        if (i + 1 != rows.length) {
                                            ids += "_";
                                        }
                                    }
                                }
                                Ext.Ajax.request({ //初始化选项卡
                                    url: "/userDeleteAllServlet?ids=" + ids,
                                    method: "GET",
                                    callback: function (options, success, response) {
                                        var resp = Ext.JSON.decode(response.responseText);
                                        Ext.MessageBox.alert("提示信息", resp.msg);
                                        if (resp.success) {
                                            var username = Ext.getCmp("username").getValue();
                                            var name = Ext.getCmp("name").getValue();
                                            var sex = Ext.getCmp("sex").getValue();
                                            var status = Ext.getCmp("status").getValue();
                                            var grid = Ext.getCmp("userDataGrid");
                                            var store = grid.getStore();
                                            store.reload({
                                                params: {
                                                    start: 0,
                                                    limit: pageSize,
                                                    username: username,
                                                    name: name,
                                                    sex: sex,
                                                    status: status
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    } else {
                        Ext.Msg.alert("错误", "请选择要删除的记录！");
                    }
                }
                }, "-"],
            bbar: [{
                xtype: 'pagingtoolbar',
                border: false,
                store: dataStore,
                displayMsg: '本页显示 {0} - {1} 条，共计 {2} 条',
                emptyMsg: "没有数据",
                beforePageText: "当前页",
                afterPageText: "共{0}页",
                displayInfo: true
            }]
        });


        var formPanelRow1 = {
            border: false,
            layout: 'column',
            items: [{
                columnWidth: .2,
                border: false,
                layout: 'form',
                items: [{
                    xtype: 'textfield',
                    id: "username",
                    fieldLabel: '用户名',
                    name: 'username'
                }]
            }, {
                columnWidth: .2,
                border: false,
                layout: 'form',
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '姓名',
                    id: "name",
                    name: 'name'
                }]
            }, {
                columnWidth: .2,
                border: false,
                layout: 'form',
                items: [{
                    xtype: 'combobox',
                    fieldLabel: '性别',
                    id: "sex",
                    name: 'sex',
                    store: [
                        ['1', '男'],
                        ['0', '女']
                    ]
                }]
            }, {
                columnWidth: .2,
                border: false,
                layout: 'form',
                items: [{
                    xtype: 'combobox',
                    fieldLabel: '状态',
                    id: "status",
                    name: 'status',
                    store: [
                        ['1', '启用'],
                        ['0', '禁用']
                    ]
                }]
            }]
        };


        dataStore.on('beforeload', function (store, options) {
            var username = Ext.getCmp("username").getValue();
            var name = Ext.getCmp("name").getValue();
            var sex = Ext.getCmp("sex").getValue();
            var status = Ext.getCmp("status").getValue();
            Ext.apply(dataStore.proxy.extraParams, {username: username, name: name, sex: sex, status: status});
        });

        //form
        var formPanel = new Ext.form.FormPanel({
            border: false,
            layout: 'form',
            labelWidth: 65,
            labelAlign: 'right',
            items: [formPanelRow1],
            buttonAlign: 'center',
            buttons: [{
                text: '查询',
                handler: function () {
                    var username = Ext.getCmp("username").getValue();
                    var name = Ext.getCmp("name").getValue();
                    var sex = Ext.getCmp("sex").getValue();
                    var status = Ext.getCmp("status").getValue();
                    var grid = Ext.getCmp("userDataGrid");
                    var store = grid.getStore();
                    store.reload({
                        params: {
                            start: 0,
                            limit: pageSize,
                            username: username,
                            name: name,
                            sex: sex,
                            status: status
                        }
                    });

                }
            }, {
                text: '重置',
                handler: function () {
                    this.up('form').getForm().reset();
                }
            }]
        });


        var searchPanel = Ext.create("Ext.panel.Panel", {
            title: '条件查询',
            border: false,
            items: [formPanel]
        });

        var panel = Ext.create("Ext.panel.Panel", {
            border: false,
            autoScroll: true,
            items: [searchPanel, dataGrid]
        })

        this.items[0] = panel;

        this.callParent();
    }
});