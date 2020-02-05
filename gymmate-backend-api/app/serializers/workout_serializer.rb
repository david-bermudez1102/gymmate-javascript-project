class WorkoutSerializer < ActiveModel::Serializer
  attributes :id, :complete, :created_at, :updated_at
  belongs_to :program
end
