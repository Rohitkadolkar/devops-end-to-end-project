aws_region   = "ap-south-1"
cluster_name = "devops-eks"

vpc_cidr = "10.0.0.0/16"

node_group_instance_type = "t3.medium"
desired_capacity         = 2
min_capacity             = 1
max_capacity             = 3
