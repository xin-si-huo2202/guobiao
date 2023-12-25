//el
import {
    Pagination,
    Dialog,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Menu,
    Submenu,
    MenuItem,
    MenuItemGroup,
    Input,
    InputNumber,
    Radio,
    RadioGroup,
    RadioButton,
    Checkbox,
    CheckboxButton,
    CheckboxGroup,
    Switch,
    Select,
    Option,
    OptionGroup,
    Button,
    ButtonGroup,
    Table,
    TableColumn,
    DatePicker,
    TimePicker,
    Tooltip,
    Form,
    FormItem,
    Tabs,
    TabPane,
    Tree,
    Slider,
    Icon,
    Row,
    Col,
    Upload,
    Spinner,
    Badge,
    Card,
    Popover,
    Carousel,
    CarouselItem,
    ColorPicker,
    Container,
    Header,
    Aside,
    Main,
    Link,
    Divider,
    Image,
    Calendar,
    InfiniteScroll,
    Backtop,
    PageHeader,
    CascaderPanel,
    Loading,
    MessageBox,
    Message,
    Notification

} from "element-ui";
import "element-ui/lib/theme-chalk/index.css"; 
export default (Vue) =>{
    Vue.use(Pagination);
    Vue.use(Dialog);
    Vue.use(Tooltip);
    Vue.use(Dropdown);
    Vue.use(DropdownMenu);
    Vue.use(DropdownItem);
    Vue.use(Menu);
    Vue.use(Submenu);
    Vue.use(MenuItem);
    Vue.use(MenuItemGroup);
    Vue.use(Input);
    Vue.use(InputNumber);
    Vue.use(Radio);
    Vue.use(RadioGroup);
    Vue.use(RadioButton);
    Vue.use(Checkbox);
    Vue.use(CheckboxButton);
    Vue.use(CheckboxGroup);
    Vue.use(Switch);
    Vue.use(Select);
    Vue.use(Option);
    Vue.use(OptionGroup);
    Vue.use(Button);
    Vue.use(ButtonGroup);
    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(DatePicker);
    Vue.use(TimePicker);
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Popover);
    Vue.use(Tabs);
    Vue.use(TabPane);
    Vue.use(Tree);
    Vue.use(Slider);
    Vue.use(Icon);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Upload);
    Vue.use(Spinner);
    Vue.use(Badge);
    Vue.use(Card);
    Vue.use(Carousel);
    Vue.use(CarouselItem);
    Vue.use(ColorPicker);
    Vue.use(Container);
    Vue.use(Header);
    Vue.use(Aside);
    Vue.use(Main);
    Vue.use(InfiniteScroll);
    Vue.use(Link);
    Vue.use(Divider);
    Vue.use(Image);
    Vue.use(Calendar);
    Vue.use(Backtop);
    Vue.use(PageHeader);
    Vue.use(CascaderPanel);

    Vue.use(Loading.directive);
    Vue.prototype.$loading = Loading.service;
    Vue.prototype.$msgbox = MessageBox;
    Vue.prototype.$alert = MessageBox.alert;
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.prototype.$prompt = MessageBox.prompt;
    Vue.prototype.$notify = Notification;
    Vue.prototype.$message = Message;

}
