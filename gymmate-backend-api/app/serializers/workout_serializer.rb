class WorkoutSerializer < ActiveModel::Serializer
  attributes :id, :complete, :created_at, :updated_at
  has_many :completes
  belongs_to :program
end
