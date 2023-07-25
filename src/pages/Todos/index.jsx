import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, Tooltip, Form, Spin, Pagination } from 'antd';
import apiCall from '../../utils/apiCall';
import { getRandomColor } from '../../utils/helpers';
import { CheckCircleOutlined, DeleteOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { baseUrl } from '../../constants';
const TodoList = () => {
    const [form] = Form.useForm();
    const [todos, setTodos] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [hoveredIcon, setHoveredIcon] = useState(null);
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const showModal = () => {
        setIsModalVisible(true);
    };
    useEffect(() => {
        fetchTodos()
    }, [])
    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);
    const fetchTodos = () => {

        setLoading(true)
        apiCall(baseUrl, 'GET').then((data) => {
            const todosWithColors = data.map((todo) => ({
                ...todo,
                color: getRandomColor(),
            }));
            setTodos(todosWithColors.reverse())
            setLoading(false)
        })
    }
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTodos = todos.slice(indexOfFirstItem, indexOfLastItem);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const handleSubmit = (values) => {
        console.log(values)
        const newTask = {
            id: todos.length + 1,
            title: values.title,
            completed: false,
            color: getRandomColor(),
        };
        setTodos([newTask, ...todos]);
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const toggleCompleted = (id) => {
        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const deleteTodo = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this todo item!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
                Swal.fire('Deleted!', 'The todo item has been deleted.', 'success');
            }
        });
    };

    return (
        <div className="container mx-auto mt-10 px-4">
            <h1 className="text-2xl font-bold mb-6">Todo List</h1>
            <div className="flex mb-4 justify-end">
                <Button disabled={loading} type="primary" onClick={showModal} className='py-1 px-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md focus:outline-none'>
                    Add Todo
                </Button>
            </div>
            {loading ? <Spin /> :

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentTodos.length > 0 ? (
                        currentTodos.map((todo, index) => (
                            <div key={index} className={` rounded-lg shadow-md ${todo.color}`}>
                                <div className={`p-6 ${todo.completed ? 'line-through opacity-50' : ''}`}>
                                    <h2 className="text-lg font-bold">{todo.title}</h2>
                                </div>
                                <div className="px-6 pb-4 flex justify-end gap-2 items-center">

                                    <div style={{ width: '40px', textAlign: 'center' }}>
                                        {!todo?.completed ? (
                                            <Tooltip title="Mark as Completed" className="p-0 m-0 mb-1.5">
                                                <CheckCircleOutlined
                                                    className="icon"
                                                    style={{
                                                        fontSize: '20px',
                                                        color: hoveredIcon === todo.id ? '#EE0E2D' : '#67F56D',
                                                    }}
                                                    onClick={() => toggleCompleted(todo.id)}
                                                    onMouseEnter={() => setHoveredIcon(todo.id)}
                                                    onMouseLeave={() => setHoveredIcon(null)}
                                                />
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title="Mark as Incomplete" className="p-0 m-0 mb-1.5">
                                                <CloseCircleOutlined
                                                    className="icon"
                                                    style={{
                                                        fontSize: '20px',
                                                        color: hoveredIcon === todo.id ? '#67F56D' : '#EE0E2D',
                                                    }}
                                                    onClick={() => toggleCompleted(todo.id)}
                                                    onMouseEnter={() => setHoveredIcon(todo.id)}
                                                    onMouseLeave={() => setHoveredIcon(null)}
                                                />
                                            </Tooltip>
                                        )}
                                    </div>
                                    <Tooltip title="Delete">
                                        <DeleteOutlined onClick={() => deleteTodo(todo.id)} style={{ fontSize: '20px', color: '#EE0E2D' }} className='hover:text-red-500' />
                                    </Tooltip>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-3">No todos added yet.</p>
                    )}
                </div>}
            {!loading && <div className="flex justify-center my-6">
                <Pagination
                    current={currentPage}
                    pageSize={itemsPerPage}
                    total={todos.length}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                />
            </div>}
            <Modal
                title="Add New Todo"
                visible={isModalVisible}
                footer={null}
                onCancel={handleCancel}
            >
                <Form
                    form={form}
                    name="control-hooks"
                    onFinish={handleSubmit}
                    style={{
                        maxWidth: 600,
                    }}
                >
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: 'Please input title',
                            },
                        ]}
                    >
                        <Input
                            type="text"
                            placeholder="Enter your task..."
                        />
                    </Form.Item>
                    <div className='flex justify-end'>
                        <Form.Item
                        >
                            <Button type="primary" htmlType="submit" className=' mt-4 py-1 px-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md focus:outline-none'>
                                Add
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default TodoList;
